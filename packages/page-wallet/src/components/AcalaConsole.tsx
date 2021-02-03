import React, { FC } from 'react';

import { AirDrop } from './AirDrop';
import { Row, Col, SubTitle, FlexBox } from '@acala-dapp/ui-components';

import { UserCard } from './UserCard';
import { TokenBalances } from './TokenBalances';
import { LPBalances } from './LPBalances';
import Faucet from './Faucet';
import { useTranslation } from 'react-i18next';

export const AcalaConsole: FC = () => {
  const { t } = useTranslation('page-wallet');

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <FlexBox
          alignItems='flex-start'
          justifyContent='space-between'
        >
          <UserCard />
          <Faucet />
        </FlexBox>
      </Col>

      <Col span={24}>
        <TokenBalances />
      </Col>

      <Col span={24}>
        <SubTitle>{t('LP Tokens')}</SubTitle>
        <LPBalances />
      </Col>

      <Col span={24}>
        <AirDrop />
      </Col>
    </Row>
  );
};
