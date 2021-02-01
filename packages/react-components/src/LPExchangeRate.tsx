import React, { useState, useCallback } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';

import { FormatBalance } from '@acala-dapp/react-components';
import { styled, SwapOutlined, Tag } from '@acala-dapp/ui-components';
import type { BareProps } from '@acala-dapp/ui-components';
import { useLPExchangeRate, useApi } from '@acala-dapp/react-hooks';

import { getCurrenciesFromDexShare } from './utils';

interface LPExchangeRateProps { lp: CurrencyId }

export const LPExchangeRate = styled(({ className, lp }: LPExchangeRateProps & BareProps) => {
  const { api } = useApi();
  const [isForward, setIsForward] = useState<boolean>(true);

  const currencies = getCurrenciesFromDexShare(api, lp);
  const [supply, target] = currencies.sort((item) => item.asToken.toString() === 'AUSD' ? 1 : -1);
  const supply2Target = useLPExchangeRate(target, supply);
  const target2Supply = useLPExchangeRate(supply, target);

  const handleSwapDirection = useCallback(() => {
    setIsForward(!isForward);
  }, [isForward, setIsForward]);

  return (
    <div className={className}>
      <FormatBalance
        pair={
          isForward ? [
            {
              balance: 1,
              currency: supply
            },
            {
              balance: supply2Target,
              currency: target
            }
          ] : [
            {
              balance: 1,
              currency: target
            },
            {
              balance: target2Supply,
              currency: supply
            }
          ]
        }
        pairSymbol='≈'
      />
      <Tag
        className='lp-exchange-rate__swap-btn'
        onClick={handleSwapDirection}
      >
        <SwapOutlined />
      </Tag>
    </div>
  );
})`
  display: flex;
  align-items: center;

  .lp-exchange-rate__swap-btn {
    margin-right: 0;
    height: 19px;

    &:hover {
      background: var(--color-primary);
      color: var(--color-white);
    }
  }
`;
