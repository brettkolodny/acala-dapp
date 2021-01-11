import { useState } from 'react';

import { useSubscription } from './useSubscription';
import { useApi } from './useApi';

/**
 * @name useApi
 * @description get api context value
 */
export const useBlockNumber = (): number => {
  const { api } = useApi();
  const [blockNumber, setBlockNumber] = useState<number>(0);

  useSubscription(() => {
    return api.rpc.chain.subscribeNewHeads().subscribe({
      next: (data) => {
        setBlockNumber(data.number.toNumber());
      }
    });
  }, [api]);

  return blockNumber;
};
