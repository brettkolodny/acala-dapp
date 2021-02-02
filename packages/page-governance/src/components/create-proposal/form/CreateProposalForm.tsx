import React from 'react';
import { Form, styled } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';

import { formatter } from '../../../config';
import { Param } from './Params/Param';

interface ProposalFormItemProps extends BareProps {
  type: string;
  name: string | string[];
  label: string;
  fieldKey?: string | string[];
  field?: any;
}

export const CreateProposalForm = styled(({ className, data }: { data: ProposalFormItemProps[] } & BareProps) => {
  return (
    <div className={className}>
      {
        data.map((item, index) => {
          return (
            <Form.Item
              key={`create-proposal-${index}`}
              label={formatter(item?.name.toString() || '')}
              name={item.name}
              rules={[
                {
                  message: `${item.name} is required`,
                  required: true
                }
              ]}
            >
              <Param
                type={item.type}
              />
            </Form.Item>
          );
        })
      }
    </div>
  );
})`
`;
