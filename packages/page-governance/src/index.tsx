import React, { FC, useContext } from 'react';
import { Route, Routes } from 'react-router';
import { Overview } from './components/overview';
import { CreateProposal } from './components/create-proposal';
import { AllProposalList, ProposalDetail } from './components/proposals';
import { CouncilList } from './components/council';
import { Tabs } from '@acala-dapp/ui-components';
import { GovernanceProvider, GovernanceContext } from './components/Provider';
import { ScheduleList } from './components/schedule/list';

const Inner: FC = () => {
  const { changeTab, currentTab } = useContext(GovernanceContext);

  return (
    <Routes>
      <Route
        element={(
          <Tabs
            active={currentTab}
            onChange={changeTab}
          >
            <Tabs.Panel
              $key='overview'
              header='Overview'
            >
              <Overview />
            </Tabs.Panel>
            <Tabs.Panel
              $key='proposal'
              header='Proposal'
            >
              <AllProposalList />
            </Tabs.Panel>
            <Tabs.Panel
              $key='schedule'
              header='Schedule'
            >
              <ScheduleList />
            </Tabs.Panel>
            <Tabs.Panel
              $key='council'
              header='Council'
            >
              <CouncilList />
            </Tabs.Panel>
          </Tabs>
        )}
        path='/'
      />
    </Routes>
    //   <Routes>
    //     <Route
    //       element={<Overview />}
    //       path='/'
    //     />
    //     <Route
    //       element={<CreateProposal />}
    //       path='/create'
    //     />
    //     <Route
    //       element={<AllProposalList />}
    //       path='/proposals'
    //     />
    //     <Route
    //       element={<ProposalDetail />}
    //       path='/proposals/:id'
    //     />
    //     <Route
    //       element={<CouncilList />}
    //       path='/councils'
    //     />
    //   </Routes>
    // </div>
  );
};

const PageGovernance: FC = () => {
  return (
    <GovernanceProvider>
      <Inner />
    </GovernanceProvider>
  );
};

export default PageGovernance;
