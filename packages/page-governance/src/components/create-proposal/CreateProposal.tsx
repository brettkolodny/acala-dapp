import React, { FC, useContext } from 'react';
import { usePageTitle } from '@acala-dapp/react-environment';
import { ProcessController, ProcessItem } from './ProcessController';
import { CreateContext, CreateProvider } from './CreateProvider';
import { CheckCouncilAuthority } from './CheckCouncilAuthority';
import { CouncilAndProposal } from './CouncilAndProposal';
import { ProposalForm } from './ProposalForm';
import { ProposalSelector } from './ProposalSelector';

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

  const { selectedProposal } = useContext(CreateContext);

  return (
    <CheckCouncilAuthority>
      <ProcessController>
        <ProcessItem
          show={true}
          title='Select Proposals'
        >
          <ProposalSelector />
        </ProcessItem>
        <ProcessItem
          show={selectedProposal !== null}
          title='Initiate Proposal'
        >
          <>
            <CouncilAndProposal />
            <ProposalForm />
          </>
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
