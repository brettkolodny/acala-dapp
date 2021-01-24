import React, { FC, useContext } from 'react';
import { usePageTitle } from '@acala-dapp/react-environment';
import { Card, Form, SpaceBox } from '@acala-dapp/ui-components';

import { CreateContext, CreateProvider } from './CreateProvider';
import { CheckCouncilAuthority } from './CheckCouncilAuthority';
import { ProposalForm } from './ProposalForm';
import { ProposalSelector } from './ProposalSelector';
import { ProposalFormBottom } from './ProposalFormBottom';

export const Inner: FC = () => {
  usePageTitle({
    breadcrumb: [
      {
        content: 'Governance',
        path: '/governance'
      }
    ],
    content: 'Initiate Proposal'
  });

  const [form] = Form.useForm();
  const { selectedProposal } = useContext(CreateContext);

  return (
    <Card>
      <CheckCouncilAuthority>
        <ProposalSelector />
        {
          selectedProposal ? <ProposalForm form={form} /> : null
        }
        <SpaceBox height={16} />
        <ProposalFormBottom form={form} />
      </CheckCouncilAuthority>
    </Card>
  );
};

export const CreateProposal: FC = () => {
  return (
    <CreateProvider>
      <Inner />
    </CreateProvider>
  );
};
