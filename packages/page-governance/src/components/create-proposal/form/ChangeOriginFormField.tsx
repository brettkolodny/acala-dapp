import React, { useCallback } from 'react';
import { AntRadio as Radio,
  AntInput as Input,
  Form,
  styled,
  Switch,
  AntSelect as Select,
  AntInputNumber as InputNumber
} from '@acala-dapp/ui-components';
import type { BareProps } from '@acala-dapp/ui-components';
import { FormField } from './common';
import { ProposalFormItem } from './CreateProposalForm';

const FormItem = Form.Item;

interface ChangeOriginFormFieldProps extends BareProps {
  name: string;
  open: boolean;
}

export const ChangeOriginFormField = styled(({ className, name, open }: ChangeOriginFormFieldProps) => {
  const getFieldName = useCallback((fieldName: string[]) => {
    return [`${name}-data`, ...fieldName];
  }, [name]);

  return (
    <FormItem noStyle >
      <FormItem
        initialValue={false}
        label='ChangeOrigin'
        name={name}
      >
        <Switch />
      </FormItem>
      {
        open ? (
          <FormField className={className} >
            <ProposalFormItem
              className={className}
              label='Change To'
              name={getFieldName(['asOriginId'])}
              type='AsOriginId'
            />
          </FormField>
        ) : null
      }
    </FormItem>
  );
})`
& .schedule-field__when__data {
  width: 50%;
}
`;
