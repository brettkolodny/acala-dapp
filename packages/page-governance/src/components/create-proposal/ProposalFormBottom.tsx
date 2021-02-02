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

    const { call: callName, section } = selectedProposal;

    if (!api.tx) return;

    const call = api.tx[camelCase(section)][camelCase(callName)];

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
      const { call: callName, origin, section } = selectedProposal;
      const { args } = proposal;

      if (!callName || !origin || !section) return;

      if (selectedProposal?.patchParams) {
        Object.assign(values, selectedProposal.patchParams);
      }

      const _params = args.map((key: any) => {
        return values[key.name];
      });

      let _inner = api.tx[camelCase(section)][camelCase(callName)].apply(api, _params);

      // try change origin
      if (values['change-origin']) {
        _inner = api.tx.authority.dispatchAs(
          values['change-origin-data']?.asOrigin,
          _inner
        );
      }

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

      const call = api.tx[origin.council].propose(
        values.threshold,
        _inner,
        _inner.toU8a().length
      );

      return call;
    } catch (e) {
      console.log(e);

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
