import React, { FC, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@acala-dapp/ui-components';
import { ReactComponent as SuccessBg } from '../../assets/success-bg.svg';

import classes from './Success.module.scss';
// import { LoanContext } from './LoanProvider';
import { createProviderContext } from './CreateProvider';
import { useTranslation } from 'react-i18next';

export const Success: FC = () => {
  // const { setCurrentTab } = useContext(LoanContext);
  const navigate = useNavigate();
  const { selectedToken } = useContext(createProviderContext);

  const handleDone = (): void => {
    // setCurrentTab(selectedToken);
    navigate(`/loan/${selectedToken.asToken.toString()}`);
  };

  const { t } = useTranslation('page-loan');

  return (
    <div className={classes.root}>
      <p className={classes.title}>{t('CREATE_LOAN_SUCCESS_MESSAGE')}</p>
      <SuccessBg className={classes.bg} />
      <Button
        onClick={handleDone}
        size='small'
      >
        {t('Done')}
      </Button>
    </div>
  );
};
