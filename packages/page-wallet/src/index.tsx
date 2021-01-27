import React, { FC } from 'react';
import { useTransitionQueryParams } from '@acala-dapp/react-environment';
import { useAccounts } from '@acala-dapp/react-hooks';

import { WalletProvider } from './components/WalletProvider';
import { Tabs } from './components/Tabs';

const PageWallet: FC = () => {
  const { active } = useAccounts();

  useTransitionQueryParams([{
    account: active?.address,
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
