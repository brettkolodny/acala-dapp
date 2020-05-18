import React, { FC, useContext, useMemo, useCallback } from 'react';

import { BaseTxHistory, FormatBalance, FormatTime, FormatHash } from '@honzon-platform/react-components';
import { TableItem, Status } from '@honzon-platform/ui-components';
import { ExtrinsicHistoryData } from '@honzon-platform/react-hooks';
import { Fixed18 } from '@acala-network/app-util';
import { StakingPoolContext } from './StakingPoolProvider';

export const Transaction: FC = () => {
  const { stakingPool, action } = useContext(StakingPoolContext);

  const config = useMemo<TableItem<ExtrinsicHistoryData>[]>(() => [
    {
      align: 'left',
      dataIndex: 'hash',
      render: (value) => <FormatHash hash={value} />,
      title: 'Tx Hash'
    },
    {
      align: 'left',
      render: (data: ExtrinsicHistoryData) => {

        if (data.method === 'mint') {
          return (
            <FormatBalance
              balance={Fixed18.fromParts(data?.params[0] || 0)}
              currency={stakingPool?.stakingCurrency}
            />
          );
        }

        if (data.method === 'redeem') {
          const keys = Object.keys(data?.params[1]);

          return (
            <>
              <FormatBalance
                balance={Fixed18.fromParts(data?.params[0] || 0)}
                currency={stakingPool?.liquidCurrency}
              />
              {

              <span style={{ marginLeft: 8 }}>
                {(data?.params[1] as any).Target ? `ERA: ${data?.params[1].Target}` : keys }
              </span>
              }
            </>
          );
        }

        return '/';
      },
      title: 'Token'
    },
    {
      align: 'left',
      dataIndex: 'method',
      render: (value: string) => {
        const paramsMap: Map<string, string> = new Map([
          ['mint', 'Mint & Stake'],
          ['redeem', 'Redeem'],
          ['withdraw_redemption', 'Withdraw Redemption']
        ]);
        return paramsMap.get(value);
      },
      title: 'Stake/Redeem'
    },
    {
      align: 'right',
      dataIndex: 'time',
      render: (value) => (
        <FormatTime time={value} />
      ),
      title: 'When'
    },
    {
      align: 'right',
      dataIndex: 'success',
      render: (value) => (
        <Status success={value} />
      ),
      title: 'Result'
    }
  ], [stakingPool]);

  return (
    <BaseTxHistory
      config={config}
      method={''}
      section='homa'
    />
  );
};