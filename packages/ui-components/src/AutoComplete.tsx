import React from 'react';
import { AutoComplete as AntAutoComplete } from 'antd';
import { AutoCompleteProps as AntAutoCompleteProps } from 'antd/lib/auto-complete';
import styled from 'styled-components';

import { ArrowIcon } from './Icon';
import { Input } from './Input';

export const AutoComplete = styled(({ children, className, ...other }: AntAutoCompleteProps) => {
  return (
    <AntAutoComplete
      className={className}
      {...other}
    >
      {
        children || (
          <Input
            className='auto-complate__input'
            suffix={<ArrowIcon />}
          />
        )
      }
    </AntAutoComplete>
  );
})`
  position: relative;
  width: 100%;
`;
