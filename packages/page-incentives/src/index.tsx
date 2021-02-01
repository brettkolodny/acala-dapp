import React, { FC } from 'react';

import { Tabs, useTabs } from '@acala-dapp/ui-components';

import { IncentivesProvider } from './components/IncentivesProvider';
import { LoansReward } from './components/LoanReward';
import { LPIncentivesReward } from './components/LPIncentivesReward';

type IncentiveTabType = 'lp-staking' | 'distribution-program';

const PageDeposit: FC = () => {
  const { changeTab, currentTab } = useTabs<IncentiveTabType>('lp-staking');

  return (
    <IncentivesProvider>
      <Tabs<IncentiveTabType>
        active={currentTab}
        onChange={changeTab}
      >
        <Tabs.Panel
          $key='lp-staking'
          header='LP Staking'
          key='lp-staking'
        >
          <LPIncentivesReward />
        </Tabs.Panel>
        <Tabs.Panel
          $key='distribution-program'
          header='Distribution Program'
          key='distribution-program'
        >
          <LoansReward />
        </Tabs.Panel>
      </Tabs>
    </IncentivesProvider>
  );
};

export default PageDeposit;
