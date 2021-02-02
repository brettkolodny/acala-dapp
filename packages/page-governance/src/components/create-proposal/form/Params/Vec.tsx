import React, { FC, memo, useCallback } from 'react';
import type { TypeDef } from '@polkadot/types/types';
import { Form, Button, FlexBox } from '@acala-dapp/ui-components';
import { BaseParamProps } from './types';
import { Param } from './Param';

const Vec: FC<BaseParamProps> = ({ onChange, typeDef }) => {
  const [form] = Form.useForm();
  const subTypes = typeDef.sub as TypeDef;
  const handleValueChange = useCallback((_changedValue, values) => {
    console.log(values);

    if (onChange) {
      onChange(values[typeDef.name || 0]);
    }
  }, [onChange, typeDef]);

  return (
    <Form
      form={form}
      onValuesChange={handleValueChange}
    >
      <Form.List name={typeDef.name || 0}>
        {(fields, { add, remove }): JSX.Element => {
          return (
            <>
              {fields.map((field, index) => {
                return (
                  <div key={`field-${field.name}`}>
                    {
                      <Form.Item name={[field.name]}>
                        <Param type={subTypes.type} />
                      </Form.Item>
                    }
                    <FlexBox
                      alignItems='center'
                      justifyContent='flex-end'
                    >
                      <Button
                        className='proposal-form__remove-btn'
                        onClick={(): void => remove(field.name)}
                        type='ghost'
                      >
                        remove
                      </Button>
                    </FlexBox>
                  </div>
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
