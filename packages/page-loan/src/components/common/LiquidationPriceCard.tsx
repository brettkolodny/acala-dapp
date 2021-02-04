import React, { FC, useMemo } from 'react';
import clsx from 'clsx';

import { Fixed18, calcCollateralRatio, calcLiquidationPrice } from '@acala-network/app-util';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Card, BulletBar, BulletBarConfigItem } from '@acala-dapp/ui-components';
import { useLoanHelper, usePrice, useTranslation } from '@acala-dapp/react-hooks';
import { formatNumber } from '@acala-dapp/react-components';

import { getLoanStatus, LoanStatus } from '../../utils';
import classes from './Liquidation.module.scss';

interface Props {
  currency: CurrencyId;
}

export const LiquidationPriceCard: FC<Props> = ({ currency }) => {
  const helper = useLoanHelper(currency);
  const price = usePrice(currency);
  const { t } = useTranslation('page-loan');

  const status = useMemo<LoanStatus | null>(() => {
    if (!helper) return null;

    return getLoanStatus(helper.collateralRatio, helper.liquidationRatio);
  }, [helper]);

  const config = useMemo<BulletBarConfigItem[]>(() => {
    if (!helper || !price || !status) return [];

    return [
      {
        color: status.color,
        data: price.toNumber(2, 3) || 0,
        dataTransfer: (i: number): string => `$ ${formatNumber(i)}`,
        label: t('Current Price'),
        labelStatus: status.description
      },
      {
        color: '#0f32da',
        data: helper.liquidationPrice.toNumber(2, 3) || 0,
        dataTransfer: (i: number): string => `$ ${formatNumber(i)}`,
        label: t('Liquidation Price')
      }
    ];
  }, [helper, price, status, t]);

  if (!helper || !price || !status) {
    return null;
  }

  return (
    <Card
      divider={false}
      header={t('Liquidation Price')}
      headerClassName={clsx(classes.header, classes[status.status])}
      overflowHidden
    >
      <BulletBar config={config} />
    </Card>
  );
};

interface DynamicLiquidationProps {
  currency: CurrencyId;
  collateral: number;
  generate: number;
}

export const DynamicLiquidationPrice: FC<DynamicLiquidationProps> = ({
  collateral = 0,
  currency,
  generate = 0
}) => {
  const helper = useLoanHelper(currency);
  const price = usePrice(currency);

  const collateralRatio = useMemo<Fixed18>(() => {
    if (!helper) return Fixed18.ZERO;

    return calcCollateralRatio(
      helper.collaterals.add(Fixed18.fromNatural(collateral)).mul(helper.collateralPrice),
      helper.debitAmount.add(Fixed18.fromNatural(generate))
    );
  }, [helper, collateral, generate]);
  const { t } = useTranslation('page-loan');
  const liquidationPrice = useMemo<Fixed18>(() => {
    if (!helper) return Fixed18.ZERO;

    return calcLiquidationPrice(
      helper.collaterals.add(Fixed18.fromNatural(collateral)),
      helper.debitAmount.add(Fixed18.fromNatural(generate)),
      helper.liquidationRatio
    );
  }, [helper, collateral, generate]);

  const status = useMemo<LoanStatus | null>(() => {
    if (!helper) return null;

    return getLoanStatus(collateralRatio, helper.liquidationRatio);
  }, [helper, collateralRatio]);

  const config = useMemo<BulletBarConfigItem[]>(() => {
    if (!helper || !status || !price) return [];

    return [
      {
        color: status.color,
        data: price.toNumber(2, 3),
        dataTransfer: (i: number): string => `$ ${formatNumber(i)}`,
        label: t('Current Price'),
        labelStatus: status.description
      },
      {
        color: '#0f32da',
        data: liquidationPrice.toNumber(2, 3) || 0,
        dataTransfer: (i: number): string => `$ ${formatNumber(i)}`,
        label: t('Liquidation Price')
      }
    ];
  }, [helper, status, price, liquidationPrice, t]);

  if (!helper || !price || !status) {
    return null;
  }

  return (
    <Card
      divider={false}
      header={t('Liquidation Price')}
      headerClassName={clsx(classes.header, classes[status.status])}
      overflowHidden
    >
      <BulletBar config={config} />
    </Card>
  );
};
