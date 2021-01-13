import React, { useMemo } from 'react';

import { formatDuration, getTokenName } from '@acala-dapp/react-components';
import { Menu, Dropdown, styled } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';

import { useStakingPool, useStakingPoolFreeList, useApi, useConstants } from '@acala-dapp/react-hooks';

interface Props extends BareProps {
  value: number;
  onChange: (value: number) => void;
}

export const TargetRedeemList = styled(({
  className,
  onChange,
  value
}: Props) => {
  const { api } = useApi();
  const { liquidCurrency } = useConstants();
  const stakingPool = useStakingPool();
  const freeList = useStakingPoolFreeList();
  const _freeList = useMemo(() => {
    return freeList.map((item) => {
      const duration = stakingPool ? formatDuration(
        (item.era - stakingPool.derive.currentEra.toNumber()) *
          (api.consts.polkadotBridge.eraLength as any).toNumber() *
          4 * 1000
      ) : 0;

      const free = stakingPool ? item.amount.div(stakingPool.stakingPool.liquidExchangeRate()).toNumber() : 0;

      return {
        ...item,
        duration,
        free
      };
    });
  }, [api, freeList, stakingPool]);

  const menu = useMemo(() => {
    return (
      <Menu>
        {
          _freeList.map(({ duration, era, free }) => {
            return (
              <Menu.Item
                key={`select-option-${era}`}
                onClick={(): void => onChange(era)}
              >
                <span>
                  {`at era ${era}(≈ ${duration} days later) has ${free} ${getTokenName(liquidCurrency.asToken.toString())} can redeem`}</span>
              </Menu.Item>
            );
          })
        }
      </Menu>
    );
  }, [_freeList, liquidCurrency, onChange]);

  const currentSelect = useMemo(() => {
    if (!value) return undefined;

    return _freeList.find((item) => item.era === value);
  }, [_freeList, value]);

  return (
    <Dropdown overlay={menu} >
      <div className={className}>
        {currentSelect ? `ERA ${currentSelect.era}, Free is ${currentSelect.free}` : 'Please Select ERA'}
      </div>
    </Dropdown>
  );
})`
  color: var(--color-primary);
`;
