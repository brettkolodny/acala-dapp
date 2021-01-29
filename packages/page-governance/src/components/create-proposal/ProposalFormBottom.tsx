import React, { FC, useCallback, useContext, useMemo } from 'react';
import { camelCase } from 'lodash';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { FlexBox, Button, FormInstance, notification, ButtonGroup } from '@acala-dapp/ui-components';
import { TxButton } from '@acala-dapp/react-components';
import { useApi } from '@acala-dapp/react-hooks';

import { CreateContext } from './CreateProvider';

interface ProposalFormBottomProps {
  form: FormInstance;
}

export const ProposalFormBottom: FC<ProposalFormBottomProps> = ({ form }) => {
  const { api } = useApi();
  const { selectedProposal } = useContext(CreateContext);

  const proposal = useMemo(() => {
    if (!api || !selectedProposal) return;

    const { name, section } = selectedProposal;

    if (!api.tx) return;

    const call = api.tx[camelCase(section)][camelCase(name)];

    return call.toJSON();
  }, [api, selectedProposal]);

  const handleSubmit = useCallback(async () => {
    try {
      await form.validateFields();
    } catch (e) {
      return;
    }

    try {
      if (!selectedProposal) return;

      const values = form.getFieldsValue();
      const { name, origin, section } = selectedProposal;
      const { args } = proposal;

      if (!name || !origin || !section) return;

      if (selectedProposal?.patchParams) {
        Object.assign(values, selectedProposal.patchParams);
      }

      const getData = (key: string, value: any): any => {
        if (!key) return;

        const _key = key;
        let definition = api.registry.getDefinition(key) || '';

        definition = definition.replace(/^Option<(.*?)>$/, '$1');
        definition = definition.replace(/^Compact<(.*?)>$/, '$1');

        if (key === 'Compact<BalanceOf>') {
          return api.createType(_key as any, new FixedPointNumber(value || 0).toChainData());
        }

        if (['Ratio', 'Rate', 'UInt<128, Balance>', 'FixedU128', 'BalanceOf'].includes(definition)) {
          return api.createType(_key as any, new FixedPointNumber(value || 0).toChainData());
        }

        return api.createType(_key as any, value);
      };

      const _params = args.map((key: any) => {
        const _value = values[key.name];

        if (key.type === 'CurrencyId' || key.type === 'CurrencyIdOf') return _value;

        if (key.type.includes('Vec')) {
          return values[key.name].map((item: any) => {
            return Object.keys(item).map((n) => {
              return getData(n, item[n]);
            });
          });
        }

        return getData(key.type, _value);
      });

      let _inner = api.tx[camelCase(section)][camelCase(name)].apply(api, _params);

      // try schedule
      if (values.schedule) {
        _inner = api.tx.authority.scheduleDispatch(
          {
            [values['schedule-data']?.when?.type]: values['schedule-data']?.when?.data
          },
          values['schedule-data']?.priority || 0,
          values['schedule-data']?.withDelayedOrigin || false,
          _inner
        );
      }

      if (values.changeOrigin) {
        _inner = api.tx.authorship.dispatchAs(
          values['changeOrigin-data']?.asOrigin,
          _inner
        );
      }

      const call = api.tx[origin.council].propose(
        values.threshold,
        _inner,
        _inner.toU8a().length
      );

      return call;
    } catch (e) {
      notification.info({
        message: 'Build extrinsic failed, Please check params'
      });
    }
  }, [form, selectedProposal, proposal, api]);

  const onSuccess = useCallback(() => {
    form.resetFields();
  }, [form]);

  const handleCancel = useCallback(() => {
    history.back();
  }, []);

  return (
    <ButtonGroup>
      <Button
        onClick={handleCancel}
        type={'border'}
      >
        Cancel
      </Button>
      {
        selectedProposal ? (
          <TxButton
            call={handleSubmit}
            onInblock={onSuccess}
          >
            Submit
          </TxButton>
        ) : null
      }
    </ButtonGroup>
  );
};
