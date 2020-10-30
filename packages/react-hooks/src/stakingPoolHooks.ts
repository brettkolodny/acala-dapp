import { useState, useEffect, useMemo } from 'react';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { FixedPointNumber } from '@acala-network/sdk-core';
import { BlockNumber, SubAccountStatus, Amount } from '@acala-network/types/interfaces';

import { useApi } from './useApi';
import { useCall } from './useCall';
import { useRxStore } from './useRxStore';
import { useBalance, useIssuance } from './balanceHooks';
import { useConstants } from './useConstants';
import { usePrice } from './priceHooks';
import { StakingPoolData } from '@acala-dapp/react-environment/RxStore/type';
import { useSubscription } from './useSubscription';
import { useAccounts } from './useAccounts';

export const useStakingPool = (): StakingPoolData | null => {
  const [stakingPool, setStakingPool] = useState<StakingPoolData | null>(null);
  const { stakingPool: stakingPoolStore } = useRxStore();

  useEffect(() => {
    const subscribe = stakingPoolStore.subscribe((result) => {
      setStakingPool(result);
    });

    return (): void => subscribe.unsubscribe();
  }, [stakingPoolStore, setStakingPool]);

  return stakingPool;
};

interface FreeListItem {
  era: number;
  amount: FixedPointNumber;
  claimedUnbonding: FixedPointNumber;
  initialClaimedUnbonding: FixedPointNumber;
  unbonding: FixedPointNumber;
}

export const useStakingPoolFreeList = (): FreeListItem[] => {
  const { api } = useApi();
  const stakingPool = useStakingPool();
  const [freeList, setFreeList] = useState<FreeListItem[]>([]);

  useSubscription(() => {
    if (!api || !stakingPool?.derive) return;

    const currentEra = stakingPool.derive.currentEra.toNumber();
    const duration = stakingPool.derive.bondingDuration.toNumber();
    const eraArray = new Array(duration).fill(undefined).map((_i, index) => currentEra + 1 + index);

    return combineLatest(
      eraArray.map((duration: number) => api.query.stakingPool.unbonding<[Amount, Amount, Amount]>(duration))
    ).pipe(
      map((result) => eraArray.map((era, index) => {
        const unbonding = FixedPointNumber.fromInner(result[index][0].toString());
        const claimedUnbonding = FixedPointNumber.fromInner(result[index][1].toString());
        const initialClaimedUnbonding = FixedPointNumber.fromInner(result[index][2].toString());
        const amount = unbonding.minus(claimedUnbonding);

        return { amount, claimedUnbonding, era, initialClaimedUnbonding, unbonding };
      })),
      map((result) => result.filter((item): boolean => !item.amount.isZero()))
    ).subscribe((result) => {
      setFreeList(result);
    });
  }, [api, stakingPool]);

  return freeList;
};

export interface RedeemItem {
  era: number;
  balance: FixedPointNumber;
}

export const useRedeemList = (): RedeemItem[] => {
  const { api } = useApi();
  const { active } = useAccounts();
  const stakingPool = useStakingPool();
  const [redeemList, setRedeemList] = useState<RedeemItem[]>([]);

  useSubscription((): Observable<{ era: number; balance: Fixed18}[]> => {
    if (!stakingPool || !active) return;

    const duration = stakingPool.derive.bondingDuration.toNumber();
    const start = stakingPool.derive.currentEra.toNumber();
    const eraArray = new Array(duration).fill(undefined).map((_i, index) => start + index + 2);

    return combineLatest(
      eraArray.map((era: number) => api.query.stakingPool.claimedUnbond<Balance>(active.address, era))
    ).pipe(
      map((result) => eraArray.map((era, index) => ({
        balance: result[index].isEmpty ? FixedPointNumber.ZERO : FixedPointNumber.fromInner(result[index].toString()),
        era
      }))),
      map((result) => result.filter((item): boolean => !item.balance.isZero()))
    ).subscribe((result) => {
      setRedeemList(result);
    });
  }, [stakingPool, active, api.query.stakingPool]);

  return redeemList;
};

/**
 * @name useStakingAmount
 * @description get address`s staking asset balance
 */
export const useStakingTotalAmount = (): FixedPointNumber => {
  const stakingPool = useStakingPool();
  const { liquidCurrency } = useConstants();
  const liquidBalance = useBalance(liquidCurrency);
  const liquidIssuance = useIssuance(liquidCurrency);

  const ratio = useMemo<FixedPointNumber>((): FixedPointNumber => {
    if (!liquidBalance || !liquidIssuance || liquidIssuance.isZero()) return FixedPointNumber.ZERO;

    return liquidBalance.div(liquidIssuance);
  }, [liquidBalance, liquidIssuance]);

  const totalAmount = useMemo<FixedPointNumber>((): FixedPointNumber => {
    if (!stakingPool) return FixedPointNumber.ZERO;

    return stakingPool.stakingPool.getCommunalBonded().times(ratio);
  }, [stakingPool, ratio]);

  return totalAmount;
};

/**
 * @name useStakingValue
 * @description get address`s staking asset value
 */
export const useStakingValue = (): FixedPointNumber => {
  const amount = useStakingTotalAmount();
  const { stakingCurrency } = useConstants();
  const price = usePrice(stakingCurrency);

  const value = useMemo<FixedPointNumber>(() => {
    if (!price || !amount) return FixedPointNumber.ZERO;

    return amount.times(price);
  }, [amount, price]);

  return value;
};

const YEAR = 365 * 24 * 60 * 60 * 1000;

export const useStakingRewardAPR = (): FixedPointNumber => {
  const { api } = useApi();
  const subAccountStatus = useCall<SubAccountStatus>('query.polkadotBridge.subAccounts', [1]);

  const arp = useMemo<FixedPointNumber>(() => {
    if (!subAccountStatus) return FixedPointNumber.ZERO;

    const eraLength = (api.consts.polkadotBridge.eraLength as unknown as BlockNumber).toNumber();
    const expectedBlockTime = api.consts.babe.expectedBlockTime.toNumber();
    const eraNumOfYear = YEAR / expectedBlockTime / eraLength;

    return FixedPointNumber.fromInner(subAccountStatus.mockRewardRate.toString()).times(new FixedPointNumber(eraNumOfYear));
  }, [api, subAccountStatus]);

  return arp;
};
