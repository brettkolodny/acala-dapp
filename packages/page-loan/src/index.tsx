import React, { FC } from 'react';
import { Routes, Route } from 'react-router';

import { Row, Col, Tabs, useTabs } from '@acala-dapp/ui-components';

import { CreateConsole } from './components/create-loan';
import { LoansConsole } from './components/loans';
import { EmergencyShutdown } from './components/emergency-shutdown';
import { useEmergencyShutdown, useTranslation } from '@acala-dapp/react-hooks';

type LoanTabType = 'shutdown' | 'loans';

const PageLoan: FC = () => {
  const { isShutdown } = useEmergencyShutdown();
  const { changeTab, currentTab: pageCurrentTab } = useTabs<LoanTabType>(
    isShutdown ? 'shutdown' : 'loans'
  );
  const { t } = useTranslation('page-loan');

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Tabs<LoanTabType>
          active={pageCurrentTab}
          onChange={changeTab}
        >
          <Tabs.Panel
            $key='loans'
            disabled={isShutdown}
            header={t('My Loans')}
          >
            <Routes>
              <Route
                element={<LoansConsole />}
                path='/:currency'
              />
              <Route
                element={<LoansConsole />}
                path='/'
              />
              <Route
                element={<CreateConsole />}
                path='/create'
              />
            </Routes>
          </Tabs.Panel>
          <Tabs.Panel
            $key='shutdown'
            disabled={!isShutdown}
            header={t('Emergency Shutdown')}
          >
            <EmergencyShutdown />
          </Tabs.Panel>
        </Tabs>
      </Col>
    </Row>
  );
};

export default PageLoan;
