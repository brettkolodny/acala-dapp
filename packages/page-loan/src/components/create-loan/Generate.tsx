import React, { useContext, FC, useCallback, useMemo } from 'react';

import { Fixed18, calcCanGenerate } from '@acala-network/app-util';
import { FixedPointNumber } from '@acala-network/sdk-core';

import { BalanceInput, UserBalance, FormatBalance, getTokenName, BalanceInputValue, focusToFixedPointNumber } from '@acala-dapp/react-components';
import { useConstants, useBalance, useLoanHelper, useBalanceValidator, useMemState, useTranslation } from '@acala-dapp/react-hooks';
import { Button } from '@acala-dapp/ui-components';

import { createProviderContext } from './CreateProvider';
import classes from './Generate.module.scss';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';

export const Generate: FC = () => {
  const {
    cancelCreate,
    selectedToken,
    setDeposit,
    setGenerate,
    setStep
  } = useContext(createProviderContext);
  const { t } = useTranslation('page-loan');
  const { minmumDebitValue, stableCurrency } = useConstants();
  const selectedCurrencyBalance = useBalance(selectedToken);
  const helper = useLoanHelper(selectedToken);
  const [collateralAmount, setColalteralAmount] = useMemState<number>(0);
  const maxGenerate = useMemo(() => {
    if (!helper) return FixedPointNumber.ZERO;

    // calculate max generate
    return focusToFixedPointNumber(calcCanGenerate(
      helper.collaterals.add(Fixed18.fromNatural(collateralAmount || 0)).mul(helper.collateralPrice),
      helper.debitAmount,
      helper.requiredCollateralRatio,
      helper.stableCoinPrice
    ));
  }, [collateralAmount, helper]);

  const [depositValue, setDepositValue, {
    error: depositError,
    setValidator: setDepositValidator
  }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: selectedToken
  });

  const [generateValue, setGenerateValue, {
    error: generateError,
    setValidator: setGenerateValidator
  }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: stableCurrency
  });

  useBalanceValidator({
    currency: selectedToken,
    updateValidator: setDepositValidator
  });

  useBalanceValidator({
    checkBalance: false,
    currency: stableCurrency,
    max: [maxGenerate, ''],
    min: [FixedPointNumber.ONE, t('MINIMUM_DEBIT_ALERT')],
    updateValidator: setGenerateValidator
  });

  const handleNext = useCallback((): void => {
    setStep('confirm');
  }, [setStep]);

  const handlePrevious = useCallback((): void => {
    setStep('select');
  }, [setStep]);

  const isDisabled = useMemo((): boolean => {
    if (depositError) return true;

    if (generateError) return true;

    return !(generateValue.amount && depositValue.amount);
  }, [generateValue, depositValue, depositError, generateError]);

  const handleDepositMax = useCallback((): void => {
    setDeposit(selectedCurrencyBalance.toNumber());
    setColalteralAmount(selectedCurrencyBalance.toNumber());
    setDepositValue({ amount: selectedCurrencyBalance.toNumber() });
  }, [setDepositValue, selectedCurrencyBalance, setDeposit, setColalteralAmount]);

  const handleDepositChange = useCallback(({ amount }: Partial<BalanceInputValue>) => {
    setDeposit(amount || 0);
    setColalteralAmount(amount || 0);

    setDepositValue({ amount });
  }, [setDepositValue, setDeposit, setColalteralAmount]);

  const handleGenerateChange = useCallback(({ amount }: Partial<BalanceInputValue>) => {
    setGenerate(amount || 0);

    setGenerateValue({ amount });
  }, [setGenerateValue, setGenerate]);

  if (!helper) return null;

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.console}>
          <p className={classes.title}>
            {t('DEPOSIT_TITLE', { currency: getTokenName(selectedToken.asToken.toString()) })}
          </p>
          <BalanceInput
            className={classes.input}
            error={depositError}
            onChange={handleDepositChange}
            onMax={handleDepositMax}
            size='middle'
            value={depositValue}
          />
          <div className={classes.addon}>
            <UserBalance currency={selectedToken} />
            <span>{t('Max To Lock')}</span>
          </div>
          <p className={classes.title}>
            {t('BOWORRE_TITLE', { currency: getTokenName(stableCurrency.asToken.toString()) })}
          </p>
          <BalanceInput
            className={classes.input}
            error={generateError}
            onChange={handleGenerateChange}
            size='middle'
            value={generateValue}
          />
          <div className={classes.addon}>
            <FormatBalance
              balance={maxGenerate}
              currency={stableCurrency}
            />
            <span>{t('Max To Borrow')}</span>
          </div>
          <div className={classes.addon}>
            <FormatBalance
              balance={minmumDebitValue}
              currency={stableCurrency}
            />
            <span>{t('Min To Borrow')}</span>
          </div>
        </div>
      </div>
      <div className={classes.tips}>{t('COLLATERALIZATION_NOTE')}</div>
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
        <Button
          disabled={isDisabled}
          onClick={handleNext}
          size='small'
        >
          {t('Next')}
        </Button>
      </div>
    </div>
  );
};
