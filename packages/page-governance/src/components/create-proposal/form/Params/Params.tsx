import React, { FC } from 'react';

interface ParamsProps {
  type: string;
  onChange: (value: any) => void;
}

export const Params: FC<ParamsProps> = ({ onChange, type }) => {
  return paramsFactory(type, onChange);
};
