import React, { FC, useCallback, memo } from 'react';

import { FixedPointNumber } from '@acala-network/sdk-core';
import { NumberInput as UINumberInput } from '@acala-dapp/ui-components';
import { BaseParamProps } from './types';

const Fixed18Input: FC<BaseParamProps> = ({ onChange }) => {
  const _onChange = useCallback((value) => {
    if (onChange) {
      onChange(new FixedPointNumber(value).toChainData());
    }
  /* eslint-disable-next-line */
  }, []);

  return (
    <UINumberInput
      onChange={_onChange}
    />
  );
};

export default memo(Fixed18Input);