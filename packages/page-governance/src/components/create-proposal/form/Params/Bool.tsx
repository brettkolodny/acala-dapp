import React, { FC, memo } from 'react';
import { BaseParamProps } from './types';
import { Switch } from '@acala-dapp/ui-components';

const Bool: FC<BaseParamProps> = ({ onChange, ...other }) => {
  return (
    <Switch
      onChange={onChange}
      {...other}
    />
  );
};

export default memo(Bool);
