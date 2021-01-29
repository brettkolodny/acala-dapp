import type { BareProps } from '@acala-dapp/ui-components';
import type { TypeDef } from '@polkadot/types/types';

export interface BaseParamProps<T = any> extends BareProps {
  typeDef: TypeDef;
  value?: T;
  onChange?: (value: T) => void;
}
