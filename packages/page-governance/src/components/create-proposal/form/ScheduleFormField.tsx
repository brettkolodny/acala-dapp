import React, { useCallback } from 'react';
import { AntInput as Input,
  Form,
  styled,
  Switch,
  AntSelect as Select,
  AntInputNumber as InputNumber } from '@acala-dapp/ui-components';
import type { BareProps } from '@acala-dapp/ui-components';
import { FormField } from './common';

const FormItem = Form.Item;

interface ScheduleFormFieldProps extends BareProps {
  name: string;
  open: boolean;
}

export const ScheduleFormField = styled(({ className, name, open }: ScheduleFormFieldProps) => {
  const getFieldName = useCallback((fieldName: string[]) => {
    return [`${name}-data`, ...fieldName];
  }, [name]);

  return (
    <FormItem noStyle >
      <FormItem
        initialValue={false}
        label='Schedule'
        name={name}
      >
        <Switch />
      </FormItem>
      {
        open ? (
          <FormField className={className} >
            <FormItem label='When'>
              <Input.Group compact>
                <FormItem
                  initialValue='at'
                  name={getFieldName(['when', 'type'])}
                  noStyle
                >
                  <Select>
                    <Select.Option value='at'>at</Select.Option>
                    <Select.Option value='when'>after</Select.Option>
                  </Select>
                </FormItem>
                <FormItem
                  name={getFieldName(['when', 'data'])}
                  noStyle
                >
                  <InputNumber className='schedule-field__when__data'/>
                </FormItem>
              </Input.Group>
            </FormItem>
            <FormItem
              initialValue={0}
              label='Priority'
              name={getFieldName(['priority'])}
            >
              <InputNumber
                min={0}
                step={1}
              />
            </FormItem>
            <FormItem
              initialValue={true}
              label='With Delayed Origin'
              name={getFieldName(['withDelayedOrigin'])}
            >
              <Switch />
            </FormItem>
          </FormField>
        ) : null
      }
    </FormItem>
  );
})`
& .ant-input-group.ant-input-group-compact {
  display: flex;
}
`;
