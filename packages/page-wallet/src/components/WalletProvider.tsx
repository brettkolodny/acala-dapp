import React, { createContext, FC, Dispatch, SetStateAction } from 'react';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useMemState } from '@acala-dapp/react-hooks';

export type WalletTabType = 'acala' | 'cross-chain' | 'collectibles';

export interface WalletContextData {
  activeTab: WalletTabType;
  changeActiveTab: Dispatch<SetStateAction<WalletTabType>>;
}

export const WalletContext = createContext<WalletContextData>({} as WalletContextData);

export const WalletProvider: FC<BareProps> = ({ children }) => {
  const [activeTab, changeActiveTab] = useMemState<WalletTabType>('acala');

  return (
    <WalletContext.Provider value={{
      activeTab,
      changeActiveTab
    }} >
      {children}
    </WalletContext.Provider>
  );
};
