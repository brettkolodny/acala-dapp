import React, { FC, useContext, useMemo, useCallback } from 'react';

import { FormatBalance, TxButton, numToFixed18Inner, FormatRatio } from '@acala-dapp/react-components';
import { createProviderContext } from './CreateProvider';
import { useConstants, useLoanHelper, useTranslation } from '@acala-dapp/react-hooks';
import { Fixed18, stableCoinToDebit, calcCollateralRatio } from '@acala-network/app-util';
import { Button, List } from '@acala-dapp/ui-components';
import classes from './Confirm.module.scss';

export const Confirm: FC = () => {
  const { t } = useTranslation('page-loan');
  const {
    cancelCreate,
    deposit,
    generate,
    selectedToken,
    setStep
  } = useContext(createProviderContext);
  const { stableCurrency } = useConstants();
  const helper = useLoanHelper(selectedToken);
  const isDisabled = useMemo((): boolean => {
    return false;
  }, []);

  const params = useMemo<string[]>((): any[] => {
    if (!helper) return [];

    return [
      // token name
      selectedToken,
      // collateral amount
      numToFixed18Inner(deposit),
      // debit amount
      stableCoinToDebit(
        Fixed18.fromNatural(generate),
        helper.debitExchangeRate
      ).innerToString()
    ];
  }, [helper, selectedToken, deposit, generate]);

  const handleSuccess = useCallback((): void => {
    setStep('success');
  }, [setStep]);

  const handlePrevious = useCallback((): void => {
    setStep('generate');
  }, [setStep]);

  const collateralRatio = useMemo<Fixed18>((): Fixed18 => {
    if (!helper) return Fixed18.ZERO;

    return calcCollateralRatio(
      helper.collaterals.add(Fixed18.fromNatural(deposit || 0)).mul(helper.collateralPrice),
      helper.debitAmount.add(Fixed18.fromNatural(generate || 0))
    );
  }, [helper, deposit, generate]);

  if (!helper) {
    return null;
  }

  return (
    <div className={classes.root}>
      <List style='list'>
        <List.Item
          label={t('Depositing')}
          value={
            <FormatBalance
              balance={deposit}
              currency={selectedToken}
            />
          }
        />
        <List.Item
          label={t('Borrowing')}
          value={
            <FormatBalance
              balance={generate}
              currency={stableCurrency}
            />
          }
        />
        <List.Item
          label={t('Collateralization Ratio')}
          value={
            <FormatRatio data={collateralRatio} />
          }
        />
        <List.Item
          label={t('Interest Rate')}
          value={
            <FormatRatio data={helper.stableFeeAPR} />
          }
        />
      </List>
      <div className={classes.action}>
        <Button
          onClick={cancelCreate}
          size='small'
          type='ghost'
        >
          {t('Cancel')}
        </Button>
        <Button
          onClick={handlePrevious}
          size='small'
          type='border'
        >
          {t('Prev')}
        </Button>
        <TxButton
          disabled={isDisabled}
          method='adjustLoan'
          onInblock={handleSuccess}
          params={params}
          section='honzon'
          size='small'
        >
          {t('Confirm')}
        </TxButton>
      </div>
    </div>
  );
};
