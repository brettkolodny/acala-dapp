import React, { FC } from 'react';

import { AccountId } from '@polkadot/types/interfaces';
import { useAccounts, useCall } from '@acala-dapp/react-hooks';
import { Balance } from '@acala-network/types/interfaces';

import { FormatBalance } from './format';

interface Props {
  currency: string;
  account?: AccountId | string;
}

export const AirDropAmount: FC<Props> = ({
  account,
  currency
}) => {
  const { active } = useAccounts();
  const _account = account || (active ? active.address : '');
  const { data } = useCall<Balance>('query.airDrop.airDrops', [_account, currency]);

  if (!data) {
    return null;
  }

  return (
    <FormatBalance balance={data} />
  );
};
