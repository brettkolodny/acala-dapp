import React, { FC, memo, useCallback } from 'react';
import { Card } from '@acala-dapp/ui-components';
import { TxButton, formatBalance } from '@acala-dapp/react-components';
import { useMemState, useAccounts, useQuery } from '@acala-dapp/react-hooks';
import { BalanceWrapper } from '@acala-network/types/interfaces';

export const WithdrawUnbonded: FC = memo(() => {
  const { active } = useAccounts();
  const [_refresh, setRefresh] = useMemState<number>(0);
  const { data: result } = useQuery<BalanceWrapper>('rpc.stakingPool.getAvailableUnbonded', [active ? active.address : '']);

  const handleSuccess = useCallback(() => {
    setRefresh(_refresh + 1);
  }, [_refresh, setRefresh]);

  if (!result) {
    return null;
  }

  return (
    <Card>
      <p>
        {`You have ${formatBalance(result.amount)} can withdraw`}
      </p>
      {
        !result.amount.isEmpty && (
          <TxButton
            method='withdrawRedemption'
            onInblock={handleSuccess}
            params={[]}
            section='homa'
          >
            Withdraw
          </TxButton>
        )
      }
    </Card>
  );
});

WithdrawUnbonded.displayName = 'WithdrawUnbonded';
