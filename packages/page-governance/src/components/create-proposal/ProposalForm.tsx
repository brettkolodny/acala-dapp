import React, { useCallback, useContext, useMemo } from 'react';
import { camelCase } from 'lodash';
import { CreateContext } from './CreateProvider';
import { styled, Form } from '@acala-dapp/ui-components';
import type { FormInstance } from '@acala-dapp/ui-components';
import { useApi, useModal } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { NumberInput, ScheduleFormField, ChangeOriginFormField, CreateProposalForm } from './form';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 }
};

interface FormData {
  schedule: boolean;
  changeOrigin: boolean;
}

interface ProposalFormProps extends BareProps {
  form: FormInstance;
}

export const ProposalForm = styled(({ className, form }: ProposalFormProps) => {
  const { api } = useApi();
  const { selectedProposal } = useContext(CreateContext);
  const proposal = useMemo(() => {
    if (!api || !selectedProposal) return;

    const { name, section } = selectedProposal;

    if (!api.tx) return;

    const call = api.tx[camelCase(section)][camelCase(name)];

    return call.toJSON();
  }, [api, selectedProposal]);

  const { status: scheduleOpenStatus, update: updateScheduleOpenStatus } = useModal(false);
  const { status: changeOriginOpenStatus, update: updateChangeOriginOpenStatus } = useModal(false);

  const handleValueChange = useCallback((values: FormData) => {
    if (Reflect.has(values, 'schedule')) {
      updateScheduleOpenStatus(values.schedule);
    }

    if (Reflect.has(values, 'changeOrigin')) {
      updateChangeOriginOpenStatus(values.changeOrigin);
    }
  }, [updateScheduleOpenStatus, updateChangeOriginOpenStatus]);

  return (
    <Form
      autoComplete='off'
      className={className}
      form={form}
      labelAlign='left'
      onValuesChange={handleValueChange}
      {...formItemLayout}
    >
      <ScheduleFormField
        name='schedule'
        open={scheduleOpenStatus}
      />
      <ChangeOriginFormField
        name='changeOrigin'
        open={changeOriginOpenStatus}
      />
      <Form.Item
        label='Threshold'
        name='threshold'
      >
        <NumberInput />
      </Form.Item>
      <CreateProposalForm data={proposal.args} />
    </Form>
  );
})`
  --form-margin: 24px;

  margin-top: 32px;

  & .ant-row {
    margin-bottom: var(--form-margin);
  }

  & .ant-row:last-child {
    margin-bottom: 0;
  }
`;
