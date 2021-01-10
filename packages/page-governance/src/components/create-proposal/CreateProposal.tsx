import React, { FC, useContext } from 'react';
import { usePageTitle } from '@acala-dapp/react-environment';
import { SelectProposal } from './SelectProposal';
import { ProcessController, ProcessItem } from './ProcessController';
import { CreateContext, CreateProvider } from './CreateProvider';
import { CheckCouncilAuthority } from './CheckCouncilAuthority';
import { CouncilAndProposal } from './CouncilAndProposal';
import { ProposalArgumentInput } from './ProposalArgumentInput';

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
          <SelectProposal />
        </ProcessItem>
        <ProcessItem
          show={selectedProposal !== null}
          title='Initiate Proposal'
        >
          <>
            <CouncilAndProposal />
            <ProposalArgumentInput />
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
