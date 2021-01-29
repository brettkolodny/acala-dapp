import React, { memo } from 'react';
import styled from 'styled-components';
import { BareProps } from './types';
import { FlexBox } from './Box';

interface ButtonGroupProps extends BareProps{
  position: 'left' | 'right';
}

export const ButtonGroup = memo(styled(({ children, className, position = 'left' }: ButtonGroupProps) => {
  return (
    <FlexBox
      className={className}
      justifyContent={position === 'left' ? 'flex-end' : 'flex-start'}
    >
      {children}
    </FlexBox>
  );
})`
  & > button + button {
    margin-left: 24px;
  }
`);
