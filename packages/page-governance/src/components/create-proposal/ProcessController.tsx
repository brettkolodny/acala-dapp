import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';
import { styled } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';

interface ProcessItemProps extends BareProps {
  show: boolean;
  title: ReactNode;
}

export const ProcessItem = styled(({
  children,
  className,
  show = true,
  title
}: ProcessItemProps) => {
  if (!show) return null;

  return (
    <div className={clsx(className, status)}>
      <div className='process-item__title'>{title}</div>
      <div className='process-item__content'>{children}</div>
    </div>
  );
})`
  position: relative;
  padding: 16px 32px;
  background: var(--color-white);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
  }

  &:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  &:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  & > .process-item__title {
    margin-bottom: 16px;
    font-size: 24px;
    color: var(--text-color-primary);
  }
`;

export const ProcessController: FC<BareProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};
