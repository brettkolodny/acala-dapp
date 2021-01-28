import React, { FC, memo } from 'react';
import { TypeDef } from '@polkadot/types/type';
import { Form, MinusCircleOutlined, Button } from '@acala-dapp/ui-components';
import { BaseParamProps } from './types';
import { useTransitionQueryParams } from '@acala-dapp/react-environment/';
import { Param } from './Param';

const Vec: FC<BaseParamProps> = ({ typeDef, onChange }) => {
  const [form] = Form.useForm();
  const subTypes = typeDef.sub as TypeDef;

  return (
    <Form form={form}>
      <Form.List name={typeDef.name || ''}>
        {(fields, { add, remove }): JSX.Element => {
          return (
            <>
              {fields.map((field) => {
                return (
                  <>
                    {
                      <Form.Item>
                        <Param type={subTypes.type} />
                      </Form.Item>
                    }
                    <MinusCircleOutlined
                      className='list-form-item__remove-btn'
                      onClick={(): void => remove(field.name)}
                      size={32}
                    />
                  </>
                );
              })}
              <Form.Item>
                <Button onClick={add}>Add</Button>
              </Form.Item>
            </>
          );
        }}
      </Form.List>
    </Form>
  );
};

export default memo(Vec);
