import React, { FC } from 'react';
import { styled } from '@acala-dapp/ui-components';
import { upperFirst } from 'lodash';

interface SelectModuleProps {
  modules: string[];
  active: string | null;
  onChange: (value: string) => void;
}

const ModuleCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: border-color .2s;

  &:hover {
    border-color: var(--input-border-color);
  }

  &.active {
    border-color: var(--input-border-color);
    box-shadow: 0 0 2px 2px var(--input-shadow);
  }
`;

const ModuleList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
`;

function formatter (str: string): string {
  return str.split('_').map(upperFirst).join(' ');
}

export const SelectModule: FC<SelectModuleProps> = ({
  active,
  modules,
  onChange
}) => {
  return (
    <ModuleList>
      {
        modules.map((item) => {
          return (
            <ModuleCard
              className={active === item ? 'active' : ''}
              key={`create-proposal-module-${item}`}
              onClick={(): void => onChange(item)}
            >
              {formatter(item)}
            </ModuleCard>
          );
        })
      }
    </ModuleList>
  );
};
