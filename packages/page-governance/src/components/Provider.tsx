import React, { createContext, FC, useMemo, Dispatch, SetStateAction } from 'react';
import { Tabs, Form } from '@acala-dapp/ui-components';
import type { BareProps } from '@acala-dapp/ui-components/types';

type TabType = 'overview' | 'proposal' | 'schedule' | 'council'

interface GovernanceContextData {
  currentTab: TabType;
  changeTab: Dispatch<SetStateAction<TabType>>;
}

export const GovernanceContext = createContext<GovernanceContextData>({} as GovernanceContextData);

export const GovernanceProvider: FC<BareProps> = ({ children }) => {
  const { changeTab, currentTab } = Tabs.useTabs<TabType>('overview');

  const data = useMemo(() => ({
    changeTab,
    currentTab
  }), [currentTab, changeTab]);

  return (
    <GovernanceContext.Provider value={data}>
      {children}
    </GovernanceContext.Provider>
  );
};
