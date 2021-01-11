import React, { FC, useCallback, useContext, useMemo, useState } from 'react';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { camelCase } from 'lodash';
import { CreateContext } from './CreateProvider';
import { styled, Form, FlexBox, SpaceBox } from '@acala-dapp/ui-components';
import type { FieldData } from '@acala-dapp/ui-components';
import { useApi, useConstants } from '@acala-dapp/react-hooks';
import { Switch } from 'antd';
import { BareProps } from '@acala-dapp/ui-components/types';
import { TxButton } from '@acala-dapp/react-components';
import { NumberInput, BlockNumberPicker, CurrencySelector } from './ProposalFormInputs';
import { formatter } from '../../config';

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

  const renderFormItem = useCallback((item) => {
    if (item.type === 'bool') {
      return <Switch />;
    }

    if (item.type === 'Balance') {
      return <NumberInput />;
    }

    if (item.type === 'CurrencyId') {
      return <CurrencySelector />;
    }

    return null;
  }, []);

  const form = Form.useForm()[0];

  const handleSubmit = useCallback(() => {
    const values = form.getFieldsValue();

    if (!selectedProposal) return;

    const { module, name, origin } = selectedProposal;
    const { args } = proposal;

    const _params = args.map((key: any) => {
      if (key.type === 'Balance') {
        return new FixedPointNumber(values[key.name] || 0).toChainData();
      }

      if (key.type === 'bool') {
        return api.createType('bool', values[key.name] || false);
      }

      return values[key.name];
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

  console.log(proposal.args);

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
      {
        proposal.args.map((item: any) => {
          return (
            <Form.Item
              key={item.name}
              label={formatter(item.name)}
              name={item.name}
            >
              {renderFormItem(item)}
            </Form.Item>
          );
        })
      }
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
