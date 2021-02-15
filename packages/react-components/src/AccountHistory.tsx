import React, { useState, useCallback, useEffect } from 'react';

import Identicon from '@polkadot/react-identicon';
import { Dialog, Button, styled, EditIcon, Copy, CopyIcon, Loading } from '@acala-dapp/ui-components';
import { FormatAddress, FormatBalance } from '@acala-dapp/react-components';
import { HISTORY_VIEW, useAccountHistory, ExtrinsicHistoryData } from '@acala-dapp/react-hooks';
import type { InjectedAccount } from '@polkadot/extension-inject/types';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Fixed18 } from '@acala-network/app-util';

dayjs.extend(relativeTime)

const fromNow = (unix: number) => {
  return dayjs.unix(1613079552).fromNow()
}

const getAccountSubscanUrl = (address: string): string => {
  return `https://acala-testnet.subscan.io/account/${address}`;
};

const AccountCard = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 2px;
  padding: 12px;
  display: flex;
  flex-direction: column;

  .account-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .account-card__button {
    min-width: unset;
    padding: 0;
  }

  .account-card__header-content {
    color: var(--text-color-second);
  }

  .account-card__address-block {
    margin: 8px 0 16px;
    display: flex;
    align-items: center;
  }

  .account-card__address {
    margin-left: 8px;
  }

  .account-card__address-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
    color: var(--text-color-primary);
  }

  .account-card__address-detail {
    font-size: 12px;
  }

  .account-card__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text-color-second);
    font-size: 14px;
  }

  .account-card__footer-item {
    display: flex;
    align-items: center;
    cursor: pointer;

    a {
      display: inline-block;
      color: var(--text-color-second);
      &:hover {
        color: var(--text-color-second);
      }
    }

    & > p,
    & > a {
      margin-left: 8px;
    }

    &:last-child {
      margin-left: 32px;
    }
  }
`;

const HistoryRoot = styled.div`
  background: var(--platform-background);
  margin: 24px -24px -24px;

  a {
    color: var(--color-primary);

    &:hover {
      color: var(--color-primary-hover);
    }
  }
  .history__empty {
    padding: 24px;
  }

  .history__title {
    padding: 24px 24px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .history__items {
    display: table;
    width: 100%;
    padding: 0 24px;
  }
  
  .history__loading {
    min-height: 215px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .history__item {
    color: var(--text-color-second);

    &:not(:last-child) {
      border-bottom: 1px solid var(--dividing-color);
    }

    display: table-row;
  }

  .history__item-cell-detail {
    display: flex;
  }

  .history__item-cell {
    padding: 10px 0;
    display: table-cell;
    border-bottom: 1px solid var(--dividing-color);
  }

  .history__item-cell--time {
    text-align: right;
  }


`;

interface HistoryDetailProps {
  data: ExtrinsicHistoryData;
  view: typeof HISTORY_VIEW[number];
}

const HistoryDetail: React.FC<HistoryDetailProps> = ({ data, view}) => {
  if(view === 'swap') {
    if(!['add_liquidity', 'remove_liquidity'].includes(data.method)) return null

    const tokenA: string | undefined = typeof data.params[0] === 'object' ? data.params[0].Token : undefined
    const tokenB: string | undefined = typeof data.params[1] === 'object' ? data.params[1]?.Token : undefined
    const valueA: string | undefined  = data.params[2]
    const valueB: string | undefined = data.params[3]

    if(!tokenA || !tokenB || !valueA || !valueB) return null

    return <div className="history__item-cell-detail">
      <FormatBalance decimalLength={1} currency={tokenA} balance={new Fixed18(valueA)} />
      <span>+</span>
      <FormatBalance decimalLength={1} currency={tokenB} balance={new Fixed18(valueB)} />
    </div>
  }

  return null
}

interface HistoryProps {
  account: InjectedAccount;
  view: typeof HISTORY_VIEW[number];
}

const History: React.FC<HistoryProps> = ({ account, view }) => {
  const { data, loading } = useAccountHistory(account.address, view);

  console.log(data);
  if (!loading && !data?.length) {
    return (
      <HistoryRoot>
        <div className='history__empty'>Your transactions will appear here...</div>
      </HistoryRoot>
    );
  }

  return (
    <HistoryRoot>
      <div className='history__title'>
        <div>Transactions History</div>
        <a href={getAccountSubscanUrl(account.address)} rel='noopener noreferrer' target='_blank'>
          View All
        </a>
      </div>
      {loading && !data.length ? (
        <div className='history__loading'>
          <Loading />
        </div>
      ) : (
        <div className='history__items'>
          {data.map((item) => (
            <div className='history__item'>
              <div className='history__item-cell'>
                <HistoryDetail view={view} data={item} />
              </div>
              <div className='history__item-cell'>{item.method}</div>
              <div className='history__item-cell history__item-cell--time'>{fromNow(item.time)}</div>
            </div>
          ))}
        </div>
      )}
    </HistoryRoot>
  );
};

interface Props {
  account?: InjectedAccount;
  view?: typeof HISTORY_VIEW[number];
  visable: boolean;
  onCancel: () => void;
  onChange: () => void;
}

export const AccountHistory: React.FC<Props> = ({ account, view, visable, onChange, onCancel }) => {
  if (!account || !view) return null;

  return (
    <Dialog onCancel={onCancel} withClose title='Account' visiable={visable}>
      <AccountCard>
        <div className='account-card__header'>
          <div className='account-card__header-content'>Connected with EXTENSION</div>
          <Button className='account-card__button' onClick={onChange} size='small' type='ghost'>
            Change
          </Button>
        </div>
        <div className='account-card__address-block'>
          <Identicon size={32} theme='polkadot' value={account.address} />
          <div className='account-card__address'>
            <div className='account-card__address-name'>{account.name || 'User'}</div>
            <div className='account-card__address-detail'>
              <FormatAddress address={account.address} withFullAddress />
            </div>
          </div>
        </div>
        <div className='account-card__footer'>
          <Copy
            display='Copy Address Success'
            render={(): JSX.Element => (
              <div className='account-card__footer-item account-card__copy'>
                <CopyIcon />
                <p>Copy Address</p>
              </div>
            )}
            text={account.address}
            withCopy={false}
          />
          <div className='account-card__footer-item'>
            <EditIcon />
            <a href={getAccountSubscanUrl(account.address)} rel='noopener noreferrer' target='_blank'>
              View on Subscan
            </a>
          </div>
        </div>
      </AccountCard>
      <History account={account} view={view} />
    </Dialog>
  );
};
