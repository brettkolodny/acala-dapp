import React, { FC } from 'react';
import { Route, Routes } from 'react-router';
import { Overview } from './components/overview';
import { CreateProposal } from './components/create-proposal';
import { AllProposalList, ProposalDetail } from './components/proposals';
import { CouncilList } from './components/council';

console.log(CouncilList);

const PageGovernance: FC = () => {
  return (
    <Routes>
      <Route
        element={<Overview />}
        path='/'
      />
      <Route
        element={<CreateProposal />}
        path='/create'
      />
      <Route
        element={<AllProposalList />}
        path='/proposals'
      />
      <Route
        element={<ProposalDetail />}
        path='/proposals/:id'
      />
      <Route
        element={<CouncilList />}
        path='/councils'
      />
    </Routes>
  );
};

export default PageGovernance;
