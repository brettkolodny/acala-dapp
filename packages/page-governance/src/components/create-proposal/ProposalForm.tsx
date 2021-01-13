import React, { FC, useCallback, useContext, useMemo, useState } from 'react';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { camelCase } from 'lodash';
import { CreateContext } from './CreateProvider';
import { styled, Form, FlexBox, SpaceBox, Switch } from '@acala-dapp/ui-components';
import type { FieldData } from '@acala-dapp/ui-components';
import { useApi } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { TxButton } from '@acala-dapp/react-components';
import { NumberInput, BlockNumberPicker } from './ProposalFormInputs';
import { CreateProposalForm } from './CreateProposalForm';

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

export const ProposalForm: FC = styled(({ className }: BareProps) => {
  const { api } = useApi();
  const { selectedProposal } = useContext(CreateContext);
  const proposal = useMemo(() => {
    if (!api || !selectedProposal) return;

    const { module, name } = selectedProposal;

    const call = api.tx[camelCase(module)][camelCase(name)];

    return call.toJSON();
  }, [api, selectedProposal]);
  const [shouldDelay, setShouldDelayed] = useState<boolean>(false);

  const form = Form.useForm()[0];

  const handleSubmit = useCallback(() => {
    const values = form.getFieldsValue();

    console.log(values);

    if (!selectedProposal) return;

    const { module, name, origin } = selectedProposal;
    const { args } = proposal;

    const getData = (key: string, value: any): any => {
      if (!key) return;

      const _key = key;
      let definition = api.registry.getDefinition(key) || '';

      definition = definition.replace(/^Option<(.*?)>$/, '$1');
      definition = definition.replace(/^Compact<(.*?)>$/, '$1');

      if (['Ratio', 'Rate', 'UInt<128, Balance>', 'FixedU128'].includes(definition)) {
        return api.createType(_key as any, new FixedPointNumber(value || 0).toChainData());
      }

      return api.createType(_key as any, value);
    };

    const _params = args.map((key: any) => {
      const _value = values[key.name];

      if (key.type === 'CurrencyId') return _value;

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

    let _inner = api.tx[camelCase(module)][camelCase(name)].apply(api, _params);

    if (values.shouldDelay) {
      _inner = api.tx.scheduler.schedule(
        values.atBlock,
        '',
        values.delayedAtBlock,
        _inner
      );
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
    });
  }, [setShouldDelayed]);

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
        label='Delay Execute'
        name='shouldDelay'
      >
        <Switch />
      </Form.Item>
      {shouldDelay ? <DelaySubForm /> : null}
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
