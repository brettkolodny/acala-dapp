import React, { FC, memo } from 'react';

import { Input } from '@acala-dapp/ui-components';
import { BaseParamProps } from './types';

const Text: FC<BaseParamProps> = ({ onChange }) => {
  return (
    <Input onChange={onChange} />
  );
};

export default memo(Text);
