import React, { FC, memo, useCallback, useState } from 'react';
import { AntSelect as Select, styled } from '@acala-dapp/ui-components';
import { TypeDef } from '@polkadot/types/types';

import { BaseParamProps } from './types';
import { Param } from './Param';

const Enum = styled(({ className, onChange, typeDef }: BaseParamProps) => {
  const [selected, setSelected] = useState<TypeDef | null>();
  const subTypes = typeDef.sub as TypeDef[];

  const handleSelected = useCallback((index: number) => {
    setSelected(subTypes[index]);
  }, [setSelected, subTypes]);

  const handleValueChange = useCallback((value) => {
    let _value = value;

    if (!selected?.name) return;

    _value = { [selected.name.toString()]: value };

    if (onChange) {
      onChange(_value);
    }
  /* eslint-disable-next-line */
  }, [selected]);

  return (
    <div className={className}>
      <Select
        onSelect={handleSelected}
      >
        {
          subTypes.map((item, index) => (
            <Select.Option
              key={`enum_${item.name}`}
              value={index}
            >
              {item.displayName || item.name}
            </Select.Option>
          ))
        }
      </Select>
      {
        selected ? (
          <Param
            onChange={handleValueChange}
            type={selected.type}
          />
        ) : null
      }
    </div>
  );
})`
& .ant-select {
  margin-bottom: 8px;
}
`;

export default memo(Enum);
