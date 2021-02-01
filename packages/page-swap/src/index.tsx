import React, { FC, useLayoutEffect } from 'react';
import { useParams } from 'react-router';

import { Col, Row, Tabs, useTabs } from '@acala-dapp/ui-components';
import { useSubMenu } from '@acala-dapp/react-environment';

import { SwapConsole } from './components/swap';
import { DepositConsole } from './components/deposit';
import { WithdrawConsole } from './components/withdraw';
import { LiquidityInformation } from './components/common';

type SwapTabType = 'add-liquidity' | 'withdraw-liquidity';
type SwapPageType = 'swap' | 'liquidity';

const subMenu = [
  {
    content: 'Swap',
    key: 'swap'
  },
  {
    content: 'Liquidity',
    key: 'liquidity'
  }
];

const PageSwap: FC = () => {
  const { changeTab, currentTab } = useTabs<SwapTabType>('add-liquidity');
  const {
    changeTab: changeSubMenu,
    currentTab: currentSubMenu
  } = useTabs<SwapPageType>('swap');
  const { tab: pageTypeFromURL } = useParams();

  useSubMenu({
    active: currentSubMenu,
    content: subMenu,
    onClick: changeSubMenu as (key: string) => void
  });

  useLayoutEffect(() => {
    if (pageTypeFromURL) {
      changeSubMenu(pageTypeFromURL as SwapPageType);
    }
  }, [pageTypeFromURL, changeSubMenu]);

  // show swap
  if (currentSubMenu === 'swap') {
    return <SwapConsole />;
  }

  // show liquidity
  return (
    <Row gutter={[0, 24]}>
      <Col span={24}>
        <LiquidityInformation />
      </Col>
      <Col span={24}>
        <Tabs
          active={currentTab}
          onChange={changeTab}
        >
          <Tabs.Panel
            $key='add-liquidity'
            header='Add Liquidity'
          >
            <DepositConsole />
          </Tabs.Panel>
          <Tabs.Panel
            $key='widthdraw-liquidity'
            header='Withdraw Liquidity'
          >
            <WithdrawConsole />
          </Tabs.Panel>
        </Tabs>
      </Col>
    </Row>
  );
};

export default PageSwap;
