import React, { FC } from 'react';

import { Alert, Col } from '@acala-dapp/ui-components';

import { useEmergencyShutdown, useTranslation } from '@acala-dapp/react-hooks';

export const LoanAlert: FC = () => {
  const { isShutdown } = useEmergencyShutdown();
  const { t } = useTranslation('page-loan');

  // emergency shutdown message is the most important
  if (isShutdown) {
    return (
      <Col span={24}>
        <Alert
          message={t('Emergency Shutdown is Triggered')}
          type='warning'
        />
      </Col>
    );
  }

  return null;
};
