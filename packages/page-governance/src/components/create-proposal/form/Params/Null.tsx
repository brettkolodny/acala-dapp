import { FC, memo, useEffect } from 'react';
import { BaseParamProps } from './types';

const Null: FC<BaseParamProps<string>> = ({ onChange }) => {
  useEffect(() => {
    onChange && onChange('null');
  }, [onChange]);

  return null;
};

export default memo(Null);
