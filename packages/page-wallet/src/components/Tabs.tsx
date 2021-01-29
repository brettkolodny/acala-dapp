import React, { FC, useContext } from 'react';

import { useTranslation } from '@acala-dapp/react-hooks';
import { Tabs as UITabs } from '@acala-dapp/ui-components';

import { WalletContext, WalletTabType } from './WalletProvider';
import { AcalaConsole } from './AcalaConsole';
import { CrossChainConsole } from './cross-chain';
import { NFT } from './NFT';

export const Tabs: FC = () => {
  const { t } = useTranslation('page-wallet');
  const { changeTab, currentTab } = useContext(WalletContext);

  return (
    <UITabs<WalletTabType>
      active={currentTab}
      onChange={changeTab}
    >
      <UITabs.Panel
        $key='acala'
        header='Acala'
        key='acala'
      >
        <AcalaConsole />
      </UITabs.Panel>
      <UITabs.Panel
        $key='collectibles'
        header={t('Collectibles')}
        key='collectibles'
      >
        <NFT />
      </UITabs.Panel>
      <UITabs.Panel
        $key='cross-chain'
        header={t('Cross-Chain')}
        key='cross-chain'
      >
        <CrossChainConsole />
      </UITabs.Panel>
    </UITabs>
  );
};
