import React from 'react';
import { styled, Dialog, Button, CopyIcon, ShareIcon, Copy } from '@acala-dapp/ui-components';
import type { BareProps } from '@acala-dapp/ui-components';
import { useAccounts, useIsAppReady, useTransitionsHistory } from '@acala-dapp/react-hooks';

import { Account } from '../Account';
import { SubscanLink } from '../BlockBrowerLink';

const AccountStatus = styled(({ className }: BareProps) => {
  const { active, openSelectAccount } = useAccounts();
  const isReady = useIsAppReady();

  return (
    <div className={className}>
      <div className='account-status__title'>
        <p>{`${isReady ? 'Connected' : 'Connecting'} with Polkadot{.js}`}</p>
        <Button
          className='account-status__title__change-btn'
          onClick={openSelectAccount}
          rounder
          type='border'
        >
          Change
        </Button>
      </div>
      <div className='account-status__address'>
        <Account
          address={active?.address}
          icon
        />
      </div>
      <div className='account-status__action'>
        <Copy
          className='account-status__action__item'
          copyIcon={false}
          text={active?.address}
        >
          <CopyIcon />
          Copy Address
        </Copy>
        <SubscanLink
          className='account-status__action__item'
          data={{ account: active?.address }}
          type='account'
        >
          <ShareIcon />
          View on subscan
        </SubscanLink>
      </div>
    </div>
  );
})`
  border-radius: 16px;
  border: 1px solid var(--border-color);
  padding: 16px 16px 16px 24px;

  .account-status__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    font-size: 16px;
    line-height: 1.1875;
    color: var(--text-color-second);
  }
  
  .account-status__title__change-btn {
    --btn-height: 24px;
    --btn-min-width: 60px;
    --btn-font-size: 14px;
    --btn-line-height: 16px;
  }

  .account-status__address {
    margin-bottom: 24px;
  }

  .account-status__action {
    display: flex;
    align-items: center;
    margin-left: 28px;

    &__item {
      display: flex;
      align-items: center;
      margin-right: 32px;
      font-size: 16px;
      color: var(--text-color-second);

      & svg {
        & g {
          fill: var(--text-color-second);
        }
        margin-right: 8px;
      }
    }
  }
`;

interface ExtrinsicProps extends BareProps {
  section: [string];
  method: [string];
  limit: number;
}

const ExtrinsicsHistory = () => {
  const data = useTransitionsHistory({
    dataProvider: 'subscan',
    limit: 20,
    queryData: [{
      method: 'transfer',
      section: 'balances'
    }]
  });

  return (
    <div>hello</div>
  );
};

interface AccountModalProps extends BareProps {
  visible: boolean;
  close: () => void;
}

export const AccountModal = styled(({ className, close, visible }: AccountModalProps) => {
  return (
    <Dialog
      className={className}
      onCancel={close}
      title='Account'
      visible={visible}
      withClose
    >
      <AccountStatus />
      <ExtrinsicsHistory />
    </Dialog>
  );
})`
`;
