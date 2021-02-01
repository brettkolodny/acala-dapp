import React, { FC, ReactNode } from 'react';
import { Table, Card, ColumnsType } from '@acala-dapp/ui-components';
import { Token, FormatBalance, FormatRatio } from '@acala-dapp/react-components';
import { useStakingPool } from '@acala-dapp/react-hooks';
import { StakingPoolData } from '@acala-dapp/react-environment/store';

export const StakingPool: FC = () => {
  const stakingPool = useStakingPool();
  const tableConfig: ColumnsType<StakingPoolData> = [
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (value: StakingPoolData): ReactNode => (
        <Token
          currency={value.derive.stakingCurrency}
          icon
        />
      ),
      title: 'Pool'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: (value: StakingPoolData): ReactNode => <FormatBalance balance={value.stakingPool.ledger.totalBelongToLiquidHolders} />,
      title: 'Total'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: (value: StakingPoolData): ReactNode => <FormatBalance balance={value.stakingPool.ledger.bondedBelongToLiquidHolders} />,
      title: 'Total Bonded'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: (value: StakingPoolData): ReactNode => <FormatBalance balance={value.stakingPool.ledger.freePool}/>,
      title: 'Total Free'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: (value: StakingPoolData): ReactNode => <FormatBalance balance={value.stakingPool.ledger.unbondingToFree} />,
      title: 'Unbonding'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (value: StakingPoolData): ReactNode => (
        <FormatRatio data={value.stakingPool.ledger.bondedBelongToLiquidHolders.div(value.stakingPool.ledger.total)} />
      ),
      title: 'Bond Ratio'
    }
  ];

  return (
    <Card
      header='Staking Pools'
      padding={false}
    >
      {
        stakingPool?.stakingPool ? (
          <Table
            columns={tableConfig}
            dataSource={[stakingPool]}
            pagination={false}
            rowKey={'stakingPool'}
          />
        ) : null
      }
    </Card>
  );
};
