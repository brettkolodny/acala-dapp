import React, { FC, useContext, useCallback, useMemo } from 'react';
import { useFormik } from 'formik';
import { noop } from 'lodash';
import clsx from 'clsx';

import { Fixed18 } from '@acala-network/app-util';
import { List, Button, Row, Col, Condition } from '@acala-dapp/ui-components';
import { BalanceInput, FormatAddress, FormatBalance, getCurrencyIdFromName, BalanceInputValue } from '@acala-dapp/react-components';

import classes from './RenBtc.module.scss';
import { useAccounts, useApi, useMemState, useTranslation } from '@acala-dapp/react-hooks';
import { RenBtcDialog } from './RenBtcDialog';
import { RenBtcMintContext, MintStep } from './RenBtcContext';

/* eslint-disable  react/no-unescaped-entities */
const Alert: FC = () => {
  const { t } = useTranslation('page-wallet');

  return (
    <div className={classes.alert}>
      {t('REN_VM_ALERT')}
    </div>
  );
};

const MAX_BTC_AMOUNT = 10000000;

const InputStep: FC = () => {
  const { api } = useApi();
  const { setAmount, setStep } = useContext(RenBtcMintContext);
  const form = useFormik({
    initialValues: {
      amount: '' as unknown as number
    },
    onSubmit: noop
  });

  const isDisabled = useMemo<boolean>((): boolean => {
    if (form.errors.amount) return true;

    return !form.values.amount;
  }, [form]);

  const handleInput = useCallback((value: Partial<BalanceInputValue>) => {
    form.setFieldValue('amount', value.amount);
  }, [form]);

  const handleNext = useCallback(() => {
    setAmount(form.values.amount);
    setStep('confirm');
  }, [setAmount, setStep, form]);
  const { t } = useTranslation('page-wallet');

  return (
    <div className={classes.step}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <BalanceInput
            className={classes.input}
            error={form.errors.amount}
            numberInputProps={{
              max: MAX_BTC_AMOUNT,
              min: 0
            }}
            onChange={handleInput}
            value={{ amount: form.values.amount, token: getCurrencyIdFromName(api, 'RENBTC') }}
          />
        </Col>
        <Col span={24}>
          <List className={classes.inputStepInfo}>
            <List.Item
              className={clsx(classes.item, classes.destination)}
              label={t('From')}
              value={
                <div>{t('BTC Network')}</div>
              }
            />
            <List.Item
              className={clsx(classes.item, classes.receive)}
              label={t('You Will Receive')}
              value={
                <>
                  <span>≈</span>
                  <FormatBalance
                    balance={form.values.amount ? Fixed18.fromNatural(form.values.amount) : Fixed18.ZERO}
                    currency={getCurrencyIdFromName(api, 'RENBTC')}
                  />
                </>
              }
            />
          </List>
        </Col>
      </Row>
      <div className={classes.actionArea}>
        <Button
          className={classes.nextBtn}
          disabled={isDisabled}
          onClick={handleNext}
        >
          {t('Next')}
        </Button>
      </div>
    </div>
  );
};

const ConfirmStep: FC = () => {
  const { api } = useApi();
  const { amount, setStep } = useContext(RenBtcMintContext);
  const { active } = useAccounts();
  const { t } = useTranslation('page-wallet');

  const handlePrev = useCallback(() => {
    setStep('input');
  }, [setStep]);

  const handleNext = useCallback(() => {
    setStep('send');
  }, [setStep]);

  return (
    <div className={classes.step}>
      <BalanceInput
        disabled={true}
        value={{ amount: amount, token: getCurrencyIdFromName(api, 'RENBTC') }}
      />
      <List
        className={classes.confirmInfo}
        style='list'
      >
        <List.Item
          className={classes.item}
          label={t('Destination')}
          value={
            <div>
              { active ? <FormatAddress address={active.address} /> : null }
            </div>
          }
        />
        <List.Item
          className={classes.item}
          label={t('RenVM Fees')}
          value={
            <FormatBalance
              balance={Fixed18.fromNatural(0.000001)}
              currency={getCurrencyIdFromName(api, 'XBTC')}
            />
          }
        />
        <List.Item
          className={classes.item}
          label={t('BTC Fee')}
          value={
            <FormatBalance
              balance={Fixed18.fromNatural(0.000001)}
              currency={getCurrencyIdFromName(api, 'XBTC')}
            />
          }
        />
        <List.Item
          className={classes.item}
          label={t('You Will Receive')}
          value={
            <FormatBalance
              balance={Fixed18.fromNatural(amount - 0.000002)}
              currency={getCurrencyIdFromName(api, 'RENBTC')}
            />
          }
        />
      </List>
      <div className={classes.actionArea}>
        <Button
          className={classes.prevBtn}
          onClick={handlePrev}
          type='ghost'
        >
          {t('Previous')}
        </Button>
        <Button
          className={classes.nextBtn}
          onClick={handleNext}
        >
          {t('Confirm')}
        </Button>
      </div>
    </div>
  );
};

const Inner: FC = () => {
  const context = useContext(RenBtcMintContext);
  const showDialog = useMemo(() => {
    return context.step === 'send' || context.step === 'watch' || context.step === 'success';
  }, [context]);

  return (
    <>
      <Condition condition={context.step === 'input'}>
        <InputStep />
      </Condition>
      <Condition condition={context.step !== 'input'}>
        <ConfirmStep />
      </Condition>
      <RenBtcDialog
        amount={context.amount}
        btcAddress={'0x16UwLL9Risc3QfPqBUvKofHmBQ7wMtjv'}
        btcTxFee={0.000001}
        renNetworkFee={0.000001}
        show={showDialog}
      />
    </>
  );
};

export const RenBtcMint: FC = () => {
  const [step, setStep] = useMemState<MintStep>('input');
  const [amount, setAmount] = useMemState<number>(0);

  return (
    <RenBtcMintContext.Provider
      value={{
        amount,
        setAmount,
        setStep,
        step
      }}
    >
      <div className={classes.root}>
        <div className={classes.container}>
          <Alert />
          <Inner />
        </div>
      </div>
    </RenBtcMintContext.Provider>
  );
};
