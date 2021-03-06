import React, { FC } from 'react';

import { useConstants } from '@acala-dapp/react-hooks';
import { Card, List } from '@acala-dapp/ui-components';
import { UserBalance, getTokenName } from '@acala-dapp/react-components';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

interface TableData {
  token: CurrencyLike;
}

export const StakingTokeBalances: FC = () => {
  const { liquidCurrency, stakingCurrency } = useConstants();

  return (
    <Card header='Balance'
      padding={false}>
      <List style='list'>
        <List.Item
          label={getTokenName(stakingCurrency.asToken.toString())}
          value={<UserBalance currency={stakingCurrency}/>}
        />
        <List.Item
          label={getTokenName(liquidCurrency.asToken.toString())}
          value={<UserBalance currency={liquidCurrency}/>}
        />
      </List>
    </Card>
  );
};
