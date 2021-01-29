import React, { createContext, FC } from 'react';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useTabs, UseTabsReturnType } from '@acala-dapp/ui-components';

export type WalletTabType = 'acala' | 'cross-chain' | 'collectibles';

export type WalletContextData = UseTabsReturnType<WalletTabType>;

export const WalletContext = createContext<WalletContextData>({} as WalletContextData);

export const WalletProvider: FC<BareProps> = ({ children }) => {
  const { changeTab, currentTab } = useTabs<WalletTabType>('acala');

  return (
    <WalletContext.Provider value={{
      changeTab,
      currentTab
    }} >
      {children}
    </WalletContext.Provider>
  );
};
