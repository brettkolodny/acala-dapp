import React from 'react';
import Identicon from '@polkadot/react-identicon';

import { Card, CopyIcon, EditIcon, Copy, styled } from '@acala-dapp/ui-components';
import type { BareProps } from '@acala-dapp/ui-components';

import { useAccounts, useTranslation } from '@acala-dapp/react-hooks';
import { FormatAddress } from '@acala-dapp/react-components';

export const UserCard = styled(({ className }: BareProps) => {
  const { active, openSelectAccount } = useAccounts();
  const { t } = useTranslation('page-wallet');

  return (
    <Card
      className={className}
      contentClassName='user-card__content'
      padding={false}
    >
      {
        active ? (
          <>
            <Identicon
              className='icon'
              size={64}
              theme='polkadot'
              value={active.address}
            />
            <div className='info'>
              <div className='name'>
                {active.name || 'User'}
              </div>
              <FormatAddress
                address={active.address}
                className='address'
              />
            </div>
            <div className='edit'
              onClick={openSelectAccount}>
              <EditIcon />
              <p className='action'>{t('Change')}</p>
            </div>
            <Copy
              copyIcon={false}
              display='Copy Address Success'
              render={(): JSX.Element => (
                <div className='copy'>
                  <CopyIcon />
                  <p className='action'>{t('Copy')}</p>
                </div>
              )}
              text={active.address}
            />
          </>
        ) : null
      }
    </Card>
  );
})`
  display: flex;
  padding: 18px 0 18px 24px;
  width: 548px;
  border-color: #ecf0f2;

  & .user-card__content {
    width: 100%;
    display: flex;
    align-items: center;

    .icon {
      margin-right: 24px;
    }

    .info {
      flex: 1;
    }

    .name {
      width: 240px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 20px;
      line-height: 24px;
      font-weight: 500;
      color: var(--text-color-primary);

      > button {
        min-width: 0;
      }
    }

    .address {
      display: block;
      margin-top: 14px;
      font-size: 14px;
      line-height: 16px;
      color: var(--text-color-second);
    }

    .edit, .copy {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 68px;
      cursor: pointer;
    }

    .action {
      margin-top: 14px;
      font-size: 14px;
      line-height: 16px;
      color: var(--color-primary);
    }

    .copy {
      display: flex;
      height: 75px;
      border-left: 1px solid #ecf0f2;
      cursor: pointer;
    }
  }
`;
