import React, { FC, memo, useCallback, useRef } from 'react';
import { set } from 'lodash';

import { TypeDef } from '@polkadot/types/types';
import { BaseParamProps } from './types';
import { Param } from './Param';

const Tuple: FC<BaseParamProps> = ({ onChange, typeDef }) => {
  const subTypes = typeDef.sub as TypeDef[];
  const dataRef = useRef<any[]>();
  const _onChange = useCallback((index, value) => {
    if (dataRef.current) {
      set(dataRef.current, index, value);
    } else {
      dataRef.current = [];
      set(dataRef.current, index, value);
    }

    if (onChange) {
      onChange(dataRef.current);
    }
  /* eslint-disable-next-line */
  }, []);

  return (
    <div>
      {
        subTypes.map((item, index) => {
          return (
            <Param
              key={`tuple-${index}`}
              onChange={(value): void => _onChange(index, value)}
              type={item.type}
            />
          );
        })
      }
    </div>
  );
};

export default memo(Tuple);
