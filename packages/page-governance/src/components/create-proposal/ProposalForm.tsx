import React, { useCallback, useContext, useMemo } from 'react';
import { camelCase } from 'lodash';
import { CreateContext } from './CreateProvider';
import { styled, Form } from '@acala-dapp/ui-components';
import type { FormInstance } from '@acala-dapp/ui-components';
import { useApi, useModal, useAllCouncilMembers } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { NumberInput, ScheduleFormField, CreateProposalForm } from './form';

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

  const { members } = useAllCouncilMembers();

  const usedCouncil = useMemo(() => {
    if (!selectedProposal || !selectedProposal.origin || !selectedProposal.origin.council) return { data: [] };

    return members.filter((item): boolean => item.council === selectedProposal.origin.council)[0];
  }, [members, selectedProposal]);

  const requiredThreshold = useMemo(() => {
    if (!selectedProposal || !usedCouncil) return 0;

    const { origin: { denominator, numerator } } = selectedProposal;
    const councilMemberLength = usedCouncil.data.length;

    return Math.min(Math.ceil(councilMemberLength * numerator / denominator) + 1, councilMemberLength);
  }, [selectedProposal, usedCouncil]);

  const { status: scheduleOpenStatus, update: updateScheduleOpenStatus } = useModal(false);

  const handleValueChange = useCallback((values: FormData) => {
    if (Reflect.has(values, 'schedule')) {
      updateScheduleOpenStatus(values.schedule);
    }
  }, [updateScheduleOpenStatus]);

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
      <Form.Item
        extra={`at least ${requiredThreshold} members agrees`}
        label='Threshold'
        name='threshold'
        rules={[
          {
            message: 'Threshold is required',
            required: true
          },
          {
            message: `At least ${requiredThreshold} members agrees`,
            min: requiredThreshold,
            type: 'number'
          }
        ]}
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

  & .ant-form-item .aca-address-input .ant-select-selection-search-input,
  & .aca-number-input {
    height: 48px;
    border-radius: 8px;
    border: 1px solid var(--input-border-color);
  }
  
  & .aca-number-input {
    width: 100%;
  }
`;
