import React, { FC } from 'react';
import { Route, Routes } from 'react-router';
// import { CouncilPage } from './components/CouncilPage';

import { Overview } from './components/overview';
import { CreateProposal } from './components/create-proposal';
// import { ProposalPage } from './components/ProposalPage';
// import { CouncilProposalDetail } from './components/CouncilProposalDetail';

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
      {/* <Route
        element={<ProposalPage />}
        path='/proposals'
      />
      <Route
        element={<CouncilProposalDetail />}
        path='/proposals/:id'
      />
      <Route
        element={<CouncilPage />}
        path='/councils'
      /> */}
    </Routes>
  );
};

export default PageGovernance;
