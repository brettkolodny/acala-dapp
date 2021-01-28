import React, { FC, useCallback, memo } from 'react';

import { BaseParamProps } from './types';
import { AddressInput } from '@acala-dapp/react-components';

const Account: FC<BaseParamProps> = ({ onChange }) => {
  const _onChange = useCallback((value) => {
    if (onChange) {
      onChange(value.address);
    }
  /* eslint-disable-next-line */
  }, []);

  return (
    <AddressInput onChange={_onChange} />
  );
};

export default memo(Account);
