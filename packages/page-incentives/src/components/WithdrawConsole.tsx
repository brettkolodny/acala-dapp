import React, { FC, memo, useState, useContext, useCallback, useMemo } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { Vec } from '@polkadot/types';
import { Card } from '@acala-dapp/ui-components';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BalanceInput, TxButton, numToFixed18Inner, DexPoolSize, DexUserShare, BalanceInputProps, getTokenName } from '@acala-dapp/react-components';
import { useFormValidator, useDexShare } from '@acala-dapp/react-hooks';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';

import { LiquidityContext } from './LiquidityProvider';
import { ReactComponent as RightArrowIcon } from '../assets/right-arrow.svg';
import classes from './Withdraw.module.scss';
import { AccountDexTokens } from './AccountDexTokens';

interface InputAreaProps {
  error?: BalanceInputProps['error'];
  id: string;
  name: string;
  currencies?: Vec<CurrencyId>;
  value: number;
  onChange: (value: number) => void;
  token: CurrencyId;
  share: Fixed18;
  onTokenChange?: (token: CurrencyId) => void;
}

const InputArea: FC<InputAreaProps> = memo(({
  currencies,
  error,
  id,
  name,
  onChange,
  onTokenChange,
  share,
  token,
  value
}) => {
  const handleMax = useCallback(() => {
    if (!onChange || !share) return;

    onChange(share.toNumber());
  }, [onChange, share]);

  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.inputAreaTitle}>
        <p>Pool Shares</p>
        <p className={classes.inputAreaBalance}>
          Available: {share.toNumber()}
        </p>
      </div>
      <BalanceInput
        currencies={currencies}
        enableTokenSelect
        error={error}
        id={id}
        name={name}
        onChange={onChange}
        onMax={handleMax}
        onTokenChange={onTokenChange}
        showMaxBtn
        token={token}
        value={value}
      />
    </div>
  );
});

InputArea.displayName = 'InputArea';

const SelectLP: FC = () => {
  return (
    <SelectToken
    />
  );
};

export const WithdrawConsole: FC = () => {
  const lpCurrencies = useLPCurrencies();

  const [otherCurrency, setOtherCurrency] = useState<CurrencyId>(enabledCurrencyIds[0]);
  const { share } = useDexShare(otherCurrency);
  const validator = useFormValidator({
    share: {
      custom: (value: number): string | undefined => {
        const _share = convertToFixed18(share || Fixed18.ZERO);

        if (_share.isZero()) {
          return `No Shares In ${getTokenName(otherCurrency)} Liqiidity Pool`;
        }

        if (Fixed18.fromNatural(value).isGreaterThan(_share)) {
          return 'Input Shares Is Greater Than Owned';
        }
      },
      type: 'number'
    }
  });
  const form = useFormik({
    initialValues: {
      share: (('' as any) as number)
    },
    onSubmit: noop,
    validate: validator
  });

  const isDisabled = useMemo((): boolean => {
    if (form.values.share && !form.errors.share) {
      return false;
    }

    return true;
  }, [form]);

  const handleSuccess = useCallback((): void => {
    form.resetForm();
  }, [form]);

  const handleTokenChange = (currency: CurrencyId): void => {
    setOtherCurrency(currency);

    // reset form
    form.resetForm();
  };

  const handleShareChange = (value: number): void => {
    form.setFieldValue('share', value);
  };

  return (
    <Card>
      <div className={classes.main}>
        <InputArea
          currencies={enabledCurrencyIds}
          error={form.errors.share}
          id='share'
          name='share'
          onChange={handleShareChange}
          onTokenChange={handleTokenChange}
          share={share ? convertToFixed18(share) : Fixed18.ZERO}
          token={otherCurrency}
          value={form.values.share}
        />
        <RightArrowIcon className={classes.arrowIcon} />
        <div className={classes.output}>
          <div className={classes.outputTitle}>
            <p>Output: Liquidity + Reward</p>
          </div>
          <div className={classes.outputContent}>
            {
              form.values.share ? (
                <AccountDexTokens
                  token={otherCurrency}
                  withdraw={form.values.share}
                />) : null
            }
          </div>
        </div>
        <TxButton
          className={classes.txBtn}
          disabled={isDisabled}
          method='withdrawLiquidity'
          onExtrinsicSuccess={handleSuccess}
          params={[otherCurrency, numToFixed18Inner(form.values.share)]}
          section='dex'
          size='large'
        >
          Withdraw
        </TxButton>
      </div>
      <div>
        <ul className={classes.addon}>
          <li className={classes.addonItem}>
            <span>Current Pool Size</span>
            <DexPoolSize token={otherCurrency} />
          </li>
          <li className={classes.addonItem}>
            <span>Your Pool Share(%)</span>
            <DexUserShare token={otherCurrency} />
          </li>
        </ul>
      </div>
    </Card>
  );
};