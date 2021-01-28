import type { TypeDef } from '@polkadot/types/types';

export interface BaseParamProps<T = any> {
  typeDef: TypeDef;
  value?: T;
  onChange?: (value: T) => void;
}
