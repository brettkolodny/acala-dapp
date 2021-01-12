import React, { FC, useCallback, useContext, useMemo, useState } from 'react';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { camelCase } from 'lodash';
import { CreateContext } from './CreateProvider';
import { styled, Form, FlexBox, SpaceBox, MinusCircleOutlined, Button } from '@acala-dapp/ui-components';
import type { FieldData } from '@acala-dapp/ui-components';
import { useApi } from '@acala-dapp/react-hooks';
import { Switch } from '@acala-dapp/ui-components';
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

const ListFormItemArea = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: var(--form-background);
  margin-bottom: 24px;

  .list-form-item__remove-btn > svg {
    width: 24px;
    height: 24px;
  }

  .ant-form-item-control {
    margin-left: -8px;
  }

  .ant-col {
    flex: 0 0 50%;
    width: 50%;
  }

  .ant-row {
    flex: 1;
  }

  .ant-form-item {
    margin-bottom: 0;
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

  const renderFormItem = useCallback((item: { fieldKey: any; type: string; name: string | any[]; key?: string; label?: string }, field?: any) => {
    const _key = item.key ? item.key : item.name;
    const _label = item.label ? formatter(item.label) : (typeof item.name === 'string') ? formatter(item.name) : '';

    if (item.type === 'bool') {
      return (
        <Form.Item
          {...field}
          fieldKey={item.fieldKey}
          key={_key}
          label={_label}
          name={item.name}
        >
          <Switch />
        </Form.Item>
      );
    }

    if (item.type === 'Balance') {
      return (
        <Form.Item
          {...field}
          fieldKey={item.fieldKey}
          key={_key}
          label={_label}
          name={item.name}
        >
          <NumberInput />
        </Form.Item>
      );
    }

    if (item.type === 'CurrencyId') {
      return (
        <Form.Item
          {...field}
          fieldKey={item.fieldKey}
          key={_key}
          label={_label}
          name={item.name}
        >
          <CurrencySelector />
        </Form.Item>
      );
    }

    if (item.type.includes('Vec')) {
      const types = item.type.replace(/^Vec<\((.*?)\)>$/, '$1').split(',');

      const args = types.map((item: string) => ({
        fieldKey: [] as any[],
        key: item,
        label: item,
        name: [item] as any[],
        type: item
      }));

      return (
        <Form.List name={item.name} >
          {(fields, { add, remove }): JSX.Element => {
            return (
              <>
                {fields.map((field) => {
                  return (
                    <ListFormItemArea key={field.key}>
                      {
                        args.map((inner) => {
                          inner.name = [field.name, inner.key];
                          inner.fieldKey = [field.fieldKey, inner.key];

                          return renderFormItem(inner, field);
                        })
                      }
                      <MinusCircleOutlined
                        className='list-form-item__remove-btn'
                        onClick={(): void => remove(field.name)}
                        size={32}
                      />
                    </ListFormItemArea>
                  );
                })}
                <Form.Item>
                  <Button onClick={(): void => add()}>
                    Add {_label}
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      );
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

      if (key.type.includes('Vec')) {
        return values[key.name].map((item: any) => {
          return Object.keys(item).map((n) => {
            if (n === 'Balance') {
              return new FixedPointNumber(item[n] || 0).toChainData();
            }

            return item[n];
          });
        });
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
          return renderFormItem(item);
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
