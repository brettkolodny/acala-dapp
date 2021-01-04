import { useEffect, useReducer } from 'react';
import { ApiRx } from '@polkadot/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FixedPointNumber } from '@acala-network/sdk-core';

import { useApi } from '@acala-dapp/react-hooks';

import { DerivedStakingPool } from '@acala-network/api-derive';
import { StakingPool } from '@acala-network/sdk-homa';

export type StakingPoolData = {
  stakingPool: StakingPool;
  derive: DerivedStakingPool;
};

type StakingAction = {
  type: 'update';
  value: {
    data: StakingPoolData;
  };
};

type StakingPoolState = {
  data: StakingPoolData | null;
}

const initState: StakingPoolState = {
  data: null
};

const reducer = (state: StakingPoolState, action: StakingAction): StakingPoolState => {
  switch (action.type) {
    case 'update': {
      return { data: action.value.data };
    }
  }
};

export const subscribeStakingPool = (api: ApiRx): Observable<StakingPoolData> => {
  const stakingPool$ = (api.derive as any).homa.stakingPool() as Observable<DerivedStakingPool>;

  return stakingPool$.pipe(
    map((data: DerivedStakingPool): StakingPoolData => {
      const stakingPool = new StakingPool({
        bondingDuration: data.bondingDuration.toNumber(),
        currentEra: data.currentEra.toNumber(),
        defaultExchangeRate: FixedPointNumber.fromInner(data.defaultExchangeRate.toString()),
        ledger: {
          bonded: FixedPointNumber.fromInner(data.ledger.bonded.toString()),
          freePool: FixedPointNumber.fromInner(data.ledger.freePool.toString()),
          toUnbondNextEra: [
            FixedPointNumber.fromInner(data.ledger.toUnbondNextEra[0].toString()),
            FixedPointNumber.fromInner(data.ledger.toUnbondNextEra[1].toString())
          ],
          unbondingToFree: FixedPointNumber.fromInner(data.ledger.unbondingToFree.toString())
        },
        liquidTotalIssuance: FixedPointNumber.fromInner(data.liquidIssuance.toString()),
        params: {
          baseFeeRate: FixedPointNumber.fromInner(data.params.baseFeeRate.toString()),
          targetMaxFreeUnbondedRatio: FixedPointNumber.fromInner(data.params.targetMaxFreeUnbondedRatio.toString()),
          targetMinFreeUnbondedRatio: FixedPointNumber.fromInner(data.params.targetMinFreeUnbondedRatio.toString()),
          targetUnbondingToFreeRatio: FixedPointNumber.fromInner(data.params.targetUnbondingToFreeRatio.toString())
        }
      });

      return {
        derive: data,
        stakingPool: stakingPool
      };
    })
  );
};

export const useStakingStore = (): StakingPoolData | null => {
  const { api } = useApi();
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    if (!api || !api.isConnected) return;

    const subscription1 = subscribeStakingPool(api).subscribe((result) => {
      dispatch({
        type: 'update',
        value: { data: result }
      });
    });

    return (): void => {
      subscription1.unsubscribe();
    };
  }, [api]);

  return state.data;
};
