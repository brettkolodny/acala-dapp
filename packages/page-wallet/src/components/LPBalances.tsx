import React, { FC } from 'react';
import clsx from 'clsx';

import { CurrencyId } from '@acala-network/types/interfaces';
import { UserAssetBalance, TokenImage, TokenName, TransferButton, LPAmountWithShare } from '@acala-dapp/react-components';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useBalance, useLPCurrencies } from '@acala-dapp/react-hooks';

import classes from './TokenBalances.module.scss';

interface LPCardProps extends BareProps {
  currency: CurrencyId;
}

const LPCard: FC<LPCardProps> = ({ className, currency }) => {
  const balance = useBalance(currency);

  return (
    <div className={clsx(className, classes.assetCard)}>
      <div className={classes.inner}></div>
      <div className={classes.header}>
        <TokenImage
          className={classes.lpTokenImage}
          currency={currency}
        />
        <div className={classes.tokenArea}>
          <TokenName
            className={classes.name}
            currency={currency}
          />
        </div>
        <div className={classes.balanceArea}>
          <UserAssetBalance
            className={classes.currency}
            currency={currency}
          />
          <LPAmountWithShare
            className={classes.amount}
            lp={currency}
            share={balance.toNumber()}
          />
        </div>
      </div>
      <TransferButton
        className={classes.transferBtn}
        currency={currency}
        mode='lp-token'
      />
    </div>
  );
};

export const LPBalances: FC = () => {
  const allLPTokens = useLPCurrencies();

  return (
    <div className={classes.root}>
      {
        allLPTokens.map((currency: CurrencyId): JSX.Element => (
          <LPCard
            className={classes.item}
            currency={currency}
            key={`asset-card-${currency.toString()}`}
          />
        ))
      }
    </div>
  );
};
