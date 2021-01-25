import { BalanceInput, BalanceInputValue, FormatAddress, FormatBalance, getCurrencyIdFromName, TxButton } from '@acala-dapp/react-components';
import { useApi, useQuery, useCollateralAuctions, useConstants, useInputValue } from '@acala-dapp/react-hooks';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { Card, Table } from '@acala-dapp/ui-components';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';
import { AuctionInfo } from '@open-web3/orml-types/interfaces';
import { Option } from '@polkadot/types';
import React, { FC, useMemo } from 'react';

import classes from './CollateralAuctionList.module.scss';

const AuctionLastBid: FC<{ id: string }> = ({ id }) => {
  const { data: info } = useQuery<Option<AuctionInfo>>('query.auction.auctions', [id]);

  if (info) {
    console.log('!!', info.toHuman());
  }

  const bid = info?.unwrapOr(null)?.bid?.unwrapOr(null);

  if (!bid) {
    return <span>-</span>;
  }

  return (
    <div>
      <FormatAddress address={bid[0].toString()}
        copyIcon />
      <FormatBalance
        balance={bid[1]}
        currency='aUSD'
      />
    </div>
  );
};

const AuctionPayment: FC<{ id: string; target: Fixed18 }> = ({ id, target }) => {
  const { data: info } = useQuery<Option<AuctionInfo>>('query.auction.auctions', [id]);

  if (info) {
    console.log('!!', info.toHuman());
  }

  const bid = info?.unwrapOr(null)?.bid?.unwrapOr(null);

  if (!bid) {
    return <span>{target.toString()}</span>;
  }

  return (
    <span>
      {convertToFixed18(bid[1])
        .min(target)
        .toString()}
    </span>
  );
};

const AuctionReceiveCollateral: FC<{ id: string; target: Fixed18; amount: Fixed18 }> = ({ amount, id, target }) => {
  const { data: info } = useQuery<Option<AuctionInfo>>('query.auction.auctions', [id]);

  if (info) {
    console.log('!!', info.toHuman());
  }

  const bid = info?.unwrapOr(null)?.bid?.unwrapOr(null);

  if (!bid) {
    return <span>{amount.toString()}</span>;
  }

  const lastBid = convertToFixed18(bid[1]);

  return (
    <span>
      {lastBid.isGreaterThan(target)
        ? target
          .div(lastBid)
          .mul(amount)
          .toString()
        : amount.toString()}
    </span>
  );
};

const AuctionMakeBid: FC<{ id: string }> = ({ id }) => {
  const { api } = useApi();
  const [value, onChange] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: getCurrencyIdFromName(api, 'AUSD')
  });

  return (
    <div className={classes.auctionMakeBid}>
      <BalanceInput
        className={classes.auctionMakeBidInput}
        onChange={onChange}
        showIcon={false}
        size='mini'
        value={value}
      />
      <TxButton
        className={classes.auctionMakeBidButton}
        disabled={value.amount === 0}
        method='bid'
        params={[id, new FixedPointNumber(value.amount || 0).toChainData()]}
        section='auction'
        size='small'
      >
        Bid
      </TxButton>
    </div>
  );
};

const CollateralAuctionList: FC = () => {
  const data = useCollateralAuctions();

  const { stableCurrency } = useConstants();

  const columns = useMemo(() => {
    return [
      {
        key: 'id',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => item.id,
        title: 'Auction ID'
      },
      {
        key: 'owner',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <FormatAddress address={item.owner}
          copyIcon
          withMiniAddress />,
        title: 'owner'
      },
      {
        key: 'amount',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <FormatBalance balance={item.amount}
          currency={item.currency} />,
        title: 'Collateral Amt'
      },
      {
        key: 'target',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <FormatBalance balance={item.target}
          currency={stableCurrency} />,
        title: 'Target'
      },
      {
        key: 'start_time',
        render: (item: any): string => `#${item.startTime}`,
        title: 'Start Block'
      },
      {
        key: 'payment',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <AuctionPayment id={item.id}
          target={convertToFixed18(item.target)} />,
        title: 'Payment'
      },
      {
        key: 'receive_collateral',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => (
          <AuctionReceiveCollateral
            amount={convertToFixed18(item.amount)}
            id={item.id}
            target={convertToFixed18(item.target)}
          />
        ),
        title: 'Receive Collateral'
      },
      {
        key: 'bidder',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <AuctionLastBid id={item.id} />,
        title: 'Last Bid'
      },
      {
        key: 'bid',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <AuctionMakeBid id={item.id} />,
        title: 'Bid（Collateral Price in aUSD)'
      }
    ];
  }, [stableCurrency]);

  return (
    <Card header='Collateral Auction'
      padding={false}>
      <Table columns={columns}
        dataSource={data}
        rowKey='id' />
    </Card>
  );
};

export default CollateralAuctionList;
