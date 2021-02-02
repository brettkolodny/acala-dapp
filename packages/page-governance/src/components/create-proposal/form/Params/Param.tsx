import { createElement, FC, useMemo, ComponentType } from 'react';
import { getTypeDef } from '@polkadot/types';
import { TypeDefInfo } from '@polkadot/types/types';
import type { TypeDef } from '@polkadot/types/types';

import Enum from './Enum';
import Null from './Null';
import NumberInput from './NumberInput';
import Fixed18Input from './Fixed18Input';
import Account from './Account';
import Bool from './Bool';
import Tuple from './Tuple';
import Text from './Text';
import Vec from './Vec';

import { useApi } from '@acala-dapp/react-hooks';
import { BaseParamProps } from './types';

const PARAMS_COMPONENT_CONFIG: [string[], ComponentType<any>][] = [
  [['Enum'], Enum],
  [['FixedU128', 'Balance', 'Ratio', 'Rate', 'BalanceOf'], Fixed18Input],
  [['u32', 'BlockNumber'], NumberInput],
  [['AccountId'], Account],
  [['bool'], Bool],
  [['Tuple'], Tuple],
  [['H160'], Text],
  [['Vec'], Vec]
];

const pretreatmentType = ({ info, name, sub, type }: TypeDef): string => {
  if (name === 'LookupSource') return 'AccountId';

  switch (info) {
    case TypeDefInfo.Compact:
      return (sub as TypeDef).type;

    case TypeDefInfo.Option:
      return (sub as TypeDef).type;

    case TypeDefInfo.Enum:
      return 'Enum';

    case TypeDefInfo.Struct:
      return 'Struct';

    case TypeDefInfo.Tuple:
      return 'Tuple';

    case TypeDefInfo.Vec:
      if (type === 'Vec<u8>') {
        return 'Bytes';
      }

      return ['Vec<KeyValue>'].includes(type)
        ? 'Vec<KeyValue>'
        : 'Vec';

    case TypeDefInfo.VecFixed:
      if ((sub as TypeDef).type === 'u8') {
        return type;
      }

      return 'VecFixed';

    default:
      return type;
  }
};

const getActualParamsComponent = (type: TypeDef): ComponentType<any> => {
  const _type = pretreatmentType(type);
  let acturalComponent: ComponentType<any> = Null;

  for (const [types, component] of PARAMS_COMPONENT_CONFIG) {
    const isMatch = types.find((item) => _type === item);

    if (isMatch) {
      acturalComponent = component;
      break;
    }
  }

  return acturalComponent;
};

interface ParamProps extends Omit<BaseParamProps<any>, 'typeDef'> {
  type: string;
}

export const Param: FC<ParamProps> = ({ onChange, type, value }) => {
  const { api } = useApi();
  const typeDef = useMemo(() => {
    const instance = api.createType(type as any);

    return getTypeDef(instance.toRawType(), { name: type });
  }, [type, api]);

  return createElement(
    getActualParamsComponent(typeDef),
    { onChange, typeDef, value }
  );
};
