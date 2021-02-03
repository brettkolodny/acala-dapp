import React, { FC, useContext, useCallback } from 'react';
import clsx from 'clsx';

import { Dialog, Button, Row, Col, List } from '@acala-dapp/ui-components';
import { TokenImage, FormatBalance, getCurrencyIdFromName } from '@acala-dapp/react-components';
import { useApi, useFaucet, useTranslation } from '@acala-dapp/react-hooks';

import { RenBtcMintContext } from './RenBtcContext';
import classes from './RenBtc.module.scss';
import { ReactComponent as DepositSuccessIcon } from '../../assets/deposit-success.svg';
import { WalletContext } from '../WalletProvider';

export interface RenBtcDialogProps {
  show: boolean;
  btcAddress: string;
  amount: number;
  btcTxFee: number;
  renNetworkFee: number;
}

interface AddressBar {
  address: string;
  amount: number;
}

const AddressBar: FC<AddressBar> = ({
  address,
  amount
}) => {
  const { api } = useApi();
  const { t } = useTranslation('page-wallet');

  return (
    <div className={clsx(classes.bar, classes.send)}>
      <TokenImage
        className={classes.icon}
        currency={getCurrencyIdFromName(api, 'XBTC')}
      />
      <div>{t('Deposit {{amount}} BTC To', { amount })}</div>
      <div>{address}</div>
    </div>
  );
};

const BtcAddressContent: FC<Omit<RenBtcDialogProps, 'show'>> = ({
  amount,
  btcAddress,
  btcTxFee,
  renNetworkFee
}) => {
  const { api } = useApi();
  const { setStep } = useContext(RenBtcMintContext);
  const { loading, run } = useFaucet('ren');
  const { t } = useTranslation('page-wallet');

  const handleNext = useCallback(() => {
    run();
    setStep('success');
  }, [setStep, run]);

  return (
    <Row className={classes.sendDialog}
      gutter={[24, 24]}
    >
      <Col span={24}>
        <AddressBar
          address={btcAddress}
          amount={amount}
        />
      </Col>
      <Col span={24}>
        <p style={{ fontSize: 16, fontWeight: 'bold' }}>{t('REN_VM_FAUCET_ALERT')}</p>
        <p style={{ color: 'var(--text-color-second)', fontSize: 14 }}>{t('REN_VM_FAUCET_QUOTA')}</p>
      </Col>
      <Col span={24}>
        <Button
          className={classes.btn}
          loading={loading}
          onClick={handleNext}
        >
          {t('Get test renBTC from Faucet')}
        </Button>
      </Col>
      <Col span={24}>
        <List>
          <List.Item
            label={t('Integrator')}
            value='apps.acala.network'
          />
          <List.Item
            label={t('BTC Fees')}
            value={(
              <FormatBalance
                balance={btcTxFee}
                currency={getCurrencyIdFromName(api, 'RENBTC')}
              />
            )}
          />
          <List.Item
            label={t('RenVM Fees')}
            value={(
              <FormatBalance
                balance={renNetworkFee}
                currency={getCurrencyIdFromName(api, 'RENBTC')}
              />
            )}
          />
        </List>
      </Col>
    </Row>
  );
};

const SuccessBar: FC = () => {
  return (
    <div className={clsx(classes.bar, classes.send)}>
      <DepositSuccessIcon className={classes.icon} />
      <div>Deposit received</div>
      <div>Bitcoin Transaction-Acala Transaction</div>
    </div>
  );
};

const SuccessContent: FC<Omit<RenBtcDialogProps, 'show'>> = ({
  btcTxFee,
  renNetworkFee
}) => {
  const { api } = useApi();
  const { changeTab } = useContext(WalletContext);
  const { t } = useTranslation('page-wallet');

  const handleNext = useCallback(() => {
    changeTab('acala');
  }, [changeTab]);

  return (
    <Row
      className={classes.sendDialog}
      gutter={[24, 24]}
    >
      <Col span={24}>
        <SuccessBar />
      </Col>
      <Col span={24}>
        <Button
          className={classes.btn}
          onClick={handleNext}
        >
          Return
        </Button>
      </Col>
      <Col span={24}>
        <List>
          <List.Item
            label={t('Integrator')}
            value='apps.acala.network'
          />
          <List.Item
            label={t('BTC Fees')}
            value={(
              <FormatBalance
                balance={btcTxFee}
                currency={getCurrencyIdFromName(api, 'RENBTC')}
              />
            )}
          />
          <List.Item
            label={t('RenVM Network Fees')}
            value={(
              <FormatBalance
                balance={renNetworkFee}
                currency={getCurrencyIdFromName(api, 'RENBTC')}
              />
            )}
          />
        </List>
      </Col>
    </Row>
  );
};

export const RenBtcDialog: FC<RenBtcDialogProps> = ({
  show,
  ...props
}) => {
  const { setStep, step } = useContext(RenBtcMintContext);
  const { t } = useTranslation('page-wallet');

  return (
    <Dialog
      action={null}
      className={classes.dialog}
      onCancel={(): void => setStep('confirm')}
      title={t('Deposit BTC')}
      visible={show}
      withClose
    >
      {step === 'send' ? <BtcAddressContent {...props}/> : null}
      {step === 'success' ? <SuccessContent {...props}/> : null}
    </Dialog>
  );
};
