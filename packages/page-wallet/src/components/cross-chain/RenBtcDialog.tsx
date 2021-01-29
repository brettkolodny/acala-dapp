import React, { FC, useContext, useCallback } from 'react';
import clsx from 'clsx';

import { Dialog, Button, Row, Col, List } from '@acala-dapp/ui-components';
import { TokenImage, FormatBalance, getCurrencyIdFromName } from '@acala-dapp/react-components';
import { useApi, useFaucet } from '@acala-dapp/react-hooks';

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

  return (
    <div className={clsx(classes.bar, classes.send)}>
      <TokenImage
        className={classes.icon}
        currency={getCurrencyIdFromName(api, 'XBTC')}
      />
      <div>Deposit {amount} BTC To</div>
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
        <p style={{ fontSize: 16, fontWeight: 'bold' }}>For testnet purpose, renBTC is minted from faucet. RenVM will be used upon mainnet launch.</p>
        <p style={{ color: 'var(--text-color-second)', fontSize: 14 }}>Quota: max 1 renBTC / month</p>
      </Col>
      <Col span={24}>
        <Button
          className={classes.btn}
          loading={loading}
          onClick={handleNext}
        >
          Get test renBTC from Faucet
        </Button>
      </Col>
      <Col span={24}>
        <List>
          <List.Item
            label='Integrator'
            value='apps.acala.network'
          />
          <List.Item
            label='BTC Fees'
            value={(
              <FormatBalance
                balance={btcTxFee}
                currency={getCurrencyIdFromName(api, 'RENBTC')}
              />
            )}
          />
          <List.Item
            label='RenVM Network Fees'
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
  const { changeActiveTab } = useContext(WalletContext);

  const handleNext = useCallback(() => {
    changeActiveTab('acala');
  }, [changeActiveTab]);

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
            label='Integrator'
            value='apps.acala.network'
          />
          <List.Item
            label='BTC Fees'
            value={(
              <FormatBalance
                balance={btcTxFee}
                currency={getCurrencyIdFromName(api, 'RENBTC')}
              />
            )}
          />
          <List.Item
            label='RenVM Network Fees'
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

  return (
    <Dialog
      action={null}
      className={classes.dialog}
      onCancel={(): void => setStep('confirm')}
      title='Deposit BTC'
      visible={show}
      withClose
    >
      {step === 'send' ? <BtcAddressContent {...props}/> : null}
      {step === 'success' ? <SuccessContent {...props}/> : null}
    </Dialog>
  );
};
