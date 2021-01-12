import React, { FC, useMemo, ReactNode, useCallback } from 'react';
import { Form, Switch, AntRadio, styled, MinusCircleOutlined, Button } from '@acala-dapp/ui-components';
import { NumberInput, CurrencySelector } from './ProposalFormInputs';
import { formatter } from '../../config';
import { useApi } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';

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

interface ProposalFormItemProps {
  type: string;
  name: string | string[];
  label: string;
  fieldKey?: string | string[];
  field?: any;
}

export const ProposalFormItem: FC<ProposalFormItemProps> = ({
  field,
  fieldKey,
  label,
  name,
  type
}) => {
  const { api } = useApi();
  const _type = useMemo(() => {
    if (type === 'CurrencyId') return type;

    if (type.startsWith('Vec')) {
      return type.replace(/^Vec<\((.*?)\)>$/, '$1').split(',');
    }

    let definition = api.registry.getDefinition(type as any);

    definition = definition?.replace(/^Option<(.*?)>$/, '$1');
    definition = definition?.replace(/^Compact<(.*?)>$/, '$1');

    if (definition === 'Ratio') return 'FixedU128';

    if (definition === 'Rate') return 'FixedU128';

    if (definition === 'UInt<128, Balance>') return 'FixedU128';

    if (definition?.startsWith('{"_enum')) {
      return JSON.parse(definition);
    }

    return definition;
  }, [type, api]);

  const _label = useMemo(() => {
    if (label) return formatter(label);

    if (typeof name === 'string') return formatter(name);

    return '';
  }, [label, name]);

  const formItemRender = useCallback((ele: ReactNode): ReactNode => {
    return (
      <Form.Item
        {...field}
        fieldKey={fieldKey}
        label={_label}
        name={name}
      >
        {ele}
      </Form.Item>
    );
  }, [field, fieldKey, _label, name]);

  if (Array.isArray(_type)) {
    return (
      <Form.List name={name} >
        {(fields, { add, remove }): JSX.Element => {
          return (
            <>
              {fields.map((field) => {
                return (
                  <ListFormItemArea key={field.key}>
                    {
                      _type.map((inner) => {
                        const name = [field.name, inner];
                        const fieldKey = [field.fieldKey, inner];

                        return (
                          <ProposalFormItem
                            fieldKey={fieldKey}
                            key={`list-from-${name[0]}-${name[1]}`}
                            label={inner}
                            name={name}
                            type={inner}
                          />
                        );
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

  if (typeof _type === 'object') {
    if (Reflect.has(_type, '_enum')) {
      return formItemRender(
        <AntRadio.Group>
          {
            Object.keys(_type._enum).map((key: string) => {
              return (
                <AntRadio
                  key={name + key}
                  value={key}
                >
                  {_type._enum[key] === 'Null' ? key : (
                    <ProposalFormItem
                      label={key}
                      name={`${name}-${key}-value`}
                      type={_type._enum[key]}
                    />
                  )}
                </AntRadio>
              );
            })
          }
        </AntRadio.Group>
      );
    }
  }

  if (_type === 'bool') {
    return formItemRender(<Switch />);
  }

  if (_type === 'FixedU128') {
    return formItemRender(<NumberInput />);
  }

  if (_type === 'CurrencyId') {
    return formItemRender(<CurrencySelector />);
  }

  return null;
};

export const CreateProposalForm = styled(({ className, data }: { data: ProposalFormItemProps[] } & BareProps) => {
  return (
    <div className={className}>
      {
        data.map((item, index) => {
          return (
            <ProposalFormItem
              key={`create-proposal-${index}`}
              {...item}
            />
          );
        })
      }
    </div>
  );
})`
.ant-radio-group {
  display: flex;

  label {
    font-size: 18px;
    font-weight: normal;
    color: var(--text-color-primary);
  }
}

.ant-radio-wrapper {
  display: flex;
  align-items: center;

  .ant-form-item {
    margin: 0;
  }
}

.ant-form-item {
  display: flex;
  align-items: center;
}
`;
