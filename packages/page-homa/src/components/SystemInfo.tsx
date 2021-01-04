import React, { FC, useMemo } from 'react';

import { Card, List } from '@acala-dapp/ui-components';
import { FormatRatio, FormatBalance } from '@acala-dapp/react-components';
import { FixedPointNumber } from '@acala-network/sdk-core';

import { useStakingPool, useConstants } from '@acala-dapp/react-hooks';

export const SystemInfo: FC = () => {
  const { liquidCurrency, stakingCurrency } = useConstants();
  const stakingPool = useStakingPool();
  const bondedRatio = useMemo(() => {
    return stakingPool?.stakingPool.ledger.bondedBelongToLiquidHolders.div(
      stakingPool?.stakingPool.ledger.totalBelongToLiquidHolders
    );
  }, [stakingPool]);

  if (!stakingPool) return null;

  return (
    <Card header='System Info'
      padding={false}>
      <List style='list'>
        <List.Item
          label='Exchange Rate'
          value={
            <FormatBalance
              pair={[
                {
                  balance: FixedPointNumber.ONE,
                  currency: stakingCurrency
                },
                {
                  balance: FixedPointNumber.ONE.div(stakingPool.stakingPool.liquidExchangeRate()),
                  currency: liquidCurrency

                }
              ]}
              pairSymbol='≈'
            />
          }
        />
        <List.Item
          label='Bonded Ratio'
          value={
            <FormatRatio data={bondedRatio} />
          }
        />
        <List.Item
          label='Free Ratio'
          value={
            <FormatRatio data={stakingPool.stakingPool.ledger.freePoolRatio} />
          }
        />
      </List>
    </Card>
  );
};
