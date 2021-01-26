import React, { FC } from 'react';
import { useTransitionQueryParams } from '@acala-dapp/react-environment';

import { WalletProvider } from './components/WalletProvider';
import { Tabs } from './components/Tabs';

const PageWallet: FC = () => {
  useTransitionQueryParams([{
    method: 'transfer',
    section: 'currencies'
  }]);

  return (
    <WalletProvider>
      <Tabs />
    </WalletProvider>
  );
};

export default PageWallet;
