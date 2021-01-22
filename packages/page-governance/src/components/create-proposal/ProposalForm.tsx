import React, { FC, useCallback, useContext, useMemo } from 'react';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { camelCase } from 'lodash';
import { CreateContext } from './CreateProvider';
import { styled, Form, FlexBox, SpaceBox, Switch } from '@acala-dapp/ui-components';
import type { FieldData } from '@acala-dapp/ui-components';
import { useApi, useMemState } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { TxButton } from '@acala-dapp/react-components';
import { NumberInput, BlockNumberPicker } from './ProposalFormInputs';
import { CreateProposalForm, ProposalFormItem } from './CreateProposalForm';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

export const DelaySubForm = styled(({ className }: BareProps) => {
  return (
    <Form.Item
      className={className}
      label='Delay To'
      name='delayedAtBlock'
    >
      <BlockNumberPicker />
    </Form.Item>
  );
})`
  padding: 16px;
  border-radius: 8px;
  background: var(--form-background);

  .ant-form-item-control {
    margin-left: -8px;
  }

  .delay-sub-form__item {
    margin: 0;
  }
`;

export const ChangeOriginSubForm = styled(({ className }: BareProps) => {
  return (
    <ProposalFormItem
      className={className}
      label='Change To'
      name='chagnedOrigin'
      type='AsOriginId'
    />
  );
})`
  padding: 16px;
  border-radius: 8px;
  background: var(--form-background);

  .ant-form-item-control {
    margin-left: -8px;
  }

  .delay-sub-form__item {
    margin: 0;
  }
`;

export const ProposalForm: FC = styled(({ className }: BareProps) => {
  const { api } = useApi();
  const { selectedProposal } = useContext(CreateContext);
  const proposal = useMemo(() => {
    if (!api || !selectedProposal) return;

    const { name, section } = selectedProposal;

    if (!api.tx) return;

    const call = api.tx[camelCase(section)][camelCase(name)];

    return call.toJSON();
  }, [api, selectedProposal]);
  const [shouldDelay, setShouldDelayed] = useMemState<boolean>(false);
  const [shouldChangeOrigin, setShouldChangeOrigin] = useMemState<boolean>(false);

  const form = Form.useForm()[0];

  const handleSubmit = useCallback(() => {
    const values = form.getFieldsValue();

    if (!selectedProposal) return;

    const { name, origin, section } = selectedProposal;
    const { args } = proposal;

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

      const definition = api.registry.getDefinition(key.type) || '';

      if (definition.startsWith('{"_enum')) {
        const temp = JSON.parse(definition);

        if (_value === 'Null') {
          return getData(key.type, _value);
        }

        return getData(key.type, {
          [_value]: getData(temp._enum[_value], values[`${key.name}-${_value}-value`])
        });
      }

      return getData(key.type, _value);
    });

    let _inner = api.tx[camelCase(section)][camelCase(name)].apply(api, _params);

    if (values.shouldChangeOrigin) {
      if (values.delayedAtBlock) {
        _inner = api.tx.authority.scheduleDispatch(
          { at: values.delayedAtBlock },
          0,
          true,
          _inner
        );
      } else {
        _inner = api.tx.authority.dispatchAs(
          'ROOT',
          _inner
        );
      }
    }

    const call = api.tx[origin.council].propose(
      values.threshold,
      _inner,
      _inner.toU8a().length
    );

    return call;
  }, [form, selectedProposal, proposal, api]);

  const onSuccess = useCallback(() => {
    form.resetFields();
  }, [form]);

  const handleFieldsChange = useCallback((changedFields: FieldData[]) => {
    changedFields.forEach((item) => {
      if ((item.name as string[])[0] === 'shouldDelay') {
        setShouldDelayed(item.value);
      }

      if ((item.name as string[])[0] === 'shouldChangeOrigin') {
        setShouldChangeOrigin(item.value);
      }
    });
  }, [setShouldDelayed, setShouldChangeOrigin]);

  return (
    <Form
      autoComplete='off'
      className={className}
      form={form}
      labelAlign='left'
      onFieldsChange={handleFieldsChange}
      {...formItemLayout}
    >
      <Form.Item
        initialValue={false}
        label='Change Origin'
        name='shouldChangeOrigin'
      >
        <Switch />
      </Form.Item>
      {shouldChangeOrigin ? (
        <>
          <DelaySubForm />
          <ChangeOriginSubForm />
        </>
      ) : null}
      <Form.Item
        label='Threshold'
        name='threshold'
      >
        <NumberInput />
      </Form.Item>
      <CreateProposalForm data={proposal.args} />
      <SpaceBox height={16}/>
      <FlexBox
        alignItems='center'
        justifyContent='flex-end'
      >
        <TxButton
          call={handleSubmit}
          onInblock={onSuccess}
        >
          Submit
        </TxButton>
      </FlexBox>
    </Form>
  );
})`
  margin-top: 32px;
`;
