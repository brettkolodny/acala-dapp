import React, { FC, useContext, useMemo } from 'react';
import { upperFirst } from 'lodash';
import { styled, Tabs, useTabs } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';
import { ProposalData, CreateContext } from './CreateProvider';

interface SelectModuleProps {
  modules: string[];
  active: string | null;
  onChange: (value: string) => void;
}

function formatter (str: string): string {
  return str.split('_').map(upperFirst).join(' ');
}

const ProposalsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
`;

const ProposalCard = styled(({
  className,
  document,
  name
}: ProposalData & BareProps) => {
  return (
    <div className={className}>
      <p className='proposal-card__name'>{formatter(name)}</p>
      <p className='proposal-card__document'>{document}</p>
    </div>
  );
})<ProposalData & BareProps>`
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

  .proposal-card__name {
    color: var(--information-title-color);
    font-weight: 500;
    font-size: 18px;
  }

  .proposal-card__document {
    margin-top: 8px;
    font-size: 14px;
    color: var(--information-content-color);
  }
`;

export const SelectProposal: FC<SelectModuleProps> = () => {
  const { allowedProposals } = useContext(CreateContext);

  const _allowedProposals = useMemo(() => {
    return allowedProposals.reduce((acc, cur) => {
      if (Array.isArray(acc[cur.module])) {
        acc[cur.module].push(cur);
      } else {
        acc[cur.module] = [cur];
      }

      return acc;
    }, {} as Record<string, ProposalData[]>);
  }, [allowedProposals]);

  const {
    changeTabs: onSelectModule,
    currentTab: selectedModule
  } = useTabs(Object.keys(_allowedProposals)[0]);

  return (
    <Tabs
      active={selectedModule}
      onChange={onSelectModule}
    >
      {
        Object.keys(_allowedProposals).map((module): JSX.Element => {
          return (
            <Tabs.Panel
              $key={module}
              header={formatter(module)}
              key={`proposal-module-list-${module}`}
            >
              <ProposalsList>
                {
                  _allowedProposals[module].map((proposal) => {
                    return (
                      <ProposalCard
                        key={`proposal-card-${module}-${proposal.name}`}
                        {...proposal}
                      />
                    );
                  })
                }
              </ProposalsList>
            </Tabs.Panel>
          );
        })
      }
    </Tabs>
  );
};
