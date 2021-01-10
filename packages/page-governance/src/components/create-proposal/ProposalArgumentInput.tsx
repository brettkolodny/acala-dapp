import React, { FC, useCallback, useContext, useMemo } from 'react';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { camelCase } from 'lodash';
import { CreateContext } from './CreateProvider';
import { styled, Col, Form, Row, NumberInput, getInputBorder, getInputShadow, Button, FlexBox } from '@acala-dapp/ui-components';
import { useApi, useConstants } from '@acala-dapp/react-hooks';
import { Switch } from 'antd';
import { BareProps } from '@acala-dapp/ui-components/types';
import { focusToFixedPointNumber, TokenSelector, TxButton } from '@acala-dapp/react-components';
import { formatter } from '../../config';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

export const ProposalArgumentInput: FC = styled(({ className }: BareProps) => {
  const { api } = useApi();
  const { allCurrencies } = useConstants();
  const { selectedProposal } = useContext(CreateContext);
  const proposal = useMemo(() => {
    if (!api || !selectedProposal) return;

    const { module, name } = selectedProposal;
    const call = api.tx[camelCase(module)][camelCase(name)];

    return call.toJSON();
  }, [api, selectedProposal]);

  const renderFormItem = useCallback((item) => {
    if (item.type === 'bool') {
      return <Switch />;
    }

    if (item.type === 'Balance') {
      return <NumberInput />;
    }

    if (item.type === 'CurrencyId') {
      return <TokenSelector currencies={allCurrencies} />;
    }

    return null;
  }, [allCurrencies]);

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

      return values[key.name];
    });

    let _inner = api.tx[camelCase(module)][camelCase(name)].apply(api, _params);

    if (values.shouldDelay) {
      _inner = api.tx.scheduler.schedule(
        values.atBlock,
        '',
        0,
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

  return (
    <Form
      autoComplete='off'
      className={className}
      form={form}
      labelAlign='left'
      {...formItemLayout}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label='Delayed Execute'
            name='shouldDelay'
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label='When To Execute'
            name='atBlock'
          >
            <NumberInput />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label='Threshold'
            name='threshold'
          >
            <NumberInput />
          </Form.Item>
        </Col>
        {
          proposal.args.map((item) => {
            return (
              <Col
                key={`foorm-${item.name}`}
                span={12}
              >
                <Form.Item
                  label={formatter(item.name)}
                  name={item.name}
                >
                  {renderFormItem(item)}
                </Form.Item>
              </Col>
            );
          })
        }
      </Row>
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
