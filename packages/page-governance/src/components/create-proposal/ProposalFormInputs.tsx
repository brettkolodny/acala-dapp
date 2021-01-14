import React, { useCallback, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { CurrencyId } from '@acala-network/types/interfaces';
import { NumberInput as SNumberInput, styled, DatePicker } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useBlockNumber, useConstants, useLPCurrencies } from '@acala-dapp/react-hooks';
import { TokenInput } from '@acala-dapp/react-components/TokenInput';

interface BasicFormInputProps<T> extends BareProps {
  value?: T;
  onChange?: (value: T) => void;
}

export const NumberInput = styled(SNumberInput)`
  height: 48px;
  border-radius: 8px;
`;

export const BlockNumberPicker = styled(({ className, onChange }: BasicFormInputProps<number>) => {
  const [estimate, setEstimate] = useState<number>(0);
  const currentBlockNumber = useBlockNumber();

  const _onOk = useCallback((value): void => {
    if (!currentBlockNumber) return;

    const current = dayjs();
    const target = dayjs(value);
    const estimate = Math.ceil(currentBlockNumber + ((target.unix() - current.unix()) / 4));

    setEstimate(estimate);

    if (onChange) {
      onChange(estimate);
    }
  }, [currentBlockNumber, onChange]);

  return (
    <div className={className}>
      <DatePicker
        format='YYYY-MM-DD HH:mm'
        onOk={_onOk}
        showTime={{ format: 'HH:mm' }}
      />
      {estimate ? <p className='block-number-picker__estimate'>Estimate At Block: {estimate}</p> : null}
    </div>
  );
})`
  display: flex;
  align-items: flex-end;

  .block-number-picker__estimate {
    margin-left: 16px;
    font-size: 14px;
    font-weight: bold;
    color: var(--information-content-color);
  }
`;

export const CurrencySelector = styled(({ className, onChange, value }: BasicFormInputProps<CurrencyId>) => {
  const { allCurrencies } = useConstants();
  const lpCurrencies = useLPCurrencies();

  const data = useMemo(() => {
    return [...allCurrencies, ...lpCurrencies];
  }, [allCurrencies, lpCurrencies]);

  return (
    <TokenInput
      className={className}
      currencies={data}
      disableZeroCurrency={false}
      onChange={onChange}
      showBalance={false}
      value={value}
    />
  );
})`
  height: 48px;
  border-radius: 8px;

  & .token-input__menu-item__currency img {
    width: 28px;
    height: 28px;
  }
`;
