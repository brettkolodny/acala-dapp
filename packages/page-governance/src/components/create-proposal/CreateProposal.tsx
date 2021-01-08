import React, { FC, useContext } from 'react';
import { usePageTitle } from '@acala-dapp/react-environment';
import { SelectProposal } from './SelectProposal';
import { ProcessController, ProcessItem } from './ProcessController';
import { CreateContext, CreateProvider } from './CreateProvider';
import { CheckCouncilAuthority } from './CheckCouncilAuthority';

export const Inner: FC = () => {
  usePageTitle({
    breadcrumb: [
      {
        content: 'Governance Overview',
        path: '/governance'
      }
    ],
    content: 'Create Proposal'
  });

  const {
    onSelectModule,
    selectedModule
  } = useContext(CreateContext);

  return (
    <CheckCouncilAuthority>
      <ProcessController>
        <ProcessItem
          status={'active'}
          title='1. Select Proposals'
        >
          <SelectProposal />
        </ProcessItem>
      </ProcessController>
    </CheckCouncilAuthority>
  );
};

export const CreateProposal: FC = () => {
  return (
    <CreateProvider>
      <Inner />
    </CreateProvider>
  );
};
