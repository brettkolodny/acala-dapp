import React from 'react';
import { styled, Dialog, Button, CopyIcon, ShareIcon, Copy } from '@acala-dapp/ui-components';
import type { BareProps } from '@acala-dapp/ui-components';
import { useAccounts, useIsAppReady } from '@acala-dapp/react-hooks';
import { useStore } from '@acala-dapp/react-environment';

import { Account } from '../Account';
import { SubscanLink } from '../BlockBrowerLink';
import { TransitionList } from './TransitionList';

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
    --btn-height: auto;
    --btn-font-size: 14px;
    --btn-line-height: 16px;
    padding: 4px 8px;
    border-radius: 32px;
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
        margin-left: 0;
        margin-right: 8px;
      }
    }
  }
`;

const ExtrinsicsHistory = styled(({ className }: BareProps) => {
  const { data: { list } } = useStore('transitions');

  return (
    <div className={className}>
      <div className='extrinsics-history__title'>
        Transitions History
      </div>
      <div className='extrinsics-history__content'>
        <TransitionList
          data={list}
        />
      </div>
    </div>
  );
})`
  margin: 26px -24px -24px -24px;
  padding: 24px;
  background: #f7f8fa;

  & .extrinsics-history__title {
    font-size: 16px;
    line-height: 18px;
  }
`;

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
  & .ant-modal-content {
    width: 640px;
  }
  & .ant-modal-body {
    padding-bottom: 0;
  }
`;
