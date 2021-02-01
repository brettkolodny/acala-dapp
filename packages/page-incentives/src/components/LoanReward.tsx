import React, { FC } from 'react';
import { useLoansIncentiveReward } from '@acala-dapp/react-hooks';
import { ComingSoon, GridBox } from '@acala-dapp/ui-components';
import { LoanRewardCard } from './LoanRewardCard';

export const LoansReward: FC = () => {
  const { params, rewardPool } = useLoansIncentiveReward();

  if (rewardPool && rewardPool.length === 0) return <ComingSoon />;

  return (
    <GridBox
      column={4}
      padding={40}
      row={'auto'}
    >
      {
        rewardPool.map((item) => (
          <LoanRewardCard
            accumulatePeriod={params.accumulatePeriod}
            currency={item.currency}
            key={`lp-reward-${item.currency.toString()}`}
            rewardCurrency={params.currency}
            totalReward={item.reward}
          />
        ))
      }
    </GridBox>
  );
};
