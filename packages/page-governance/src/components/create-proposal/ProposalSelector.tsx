import React, { FC, useCallback, useContext, useMemo } from 'react';
import { camelCase } from 'lodash';
import clsx from 'clsx';
import { styled, Tabs, useTabs } from '@acala-dapp/ui-components';
import type { BareProps } from '@acala-dapp/ui-components';
import { useApi } from '@acala-dapp/react-hooks';

import { ProposalData, CreateContext } from './CreateProvider';
import { formatter } from '../../config';

const ProposalsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
`;

const ProposalCard = styled(({ className, data }: { data: ProposalData } & BareProps) => {
  const { api } = useApi();
  const { collective, document, name, section } = data;
  const { onSelectProposal, selectedProposal } = useContext(CreateContext);

  const handleClick = useCallback(() => {
    onSelectProposal(data);
  }, [onSelectProposal, data]);

  const isActive = useMemo(() => {
    return selectedProposal &&
      selectedProposal.name === name &&
      selectedProposal.collective === collective;
  }, [name, collective, selectedProposal]);

  // const _document = useMemo(() => {
  //   if (!api) return;

  //   const extrinsic = api.tx[camelCase(section)][camelCase(name)];
  //   const doc = extrinsic.meta.documentation.toArray().map((item) => item.toString());
  // }, [api, section, name]);

  return (
    <div
      className={clsx(className, { active: isActive })}
      onClick={handleClick}
    >
      <p className='proposal-card__name'>{formatter(name)}</p>
      <p className='proposal-card__document'>{document}</p>
    </div>
  );
})`
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: all .2s;

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

export const ProposalSelector: FC = () => {
  const { allowedProposals } = useContext(CreateContext);

  const _allowedProposals = useMemo(() => {
    return allowedProposals.reduce((acc, cur) => {
      if (Array.isArray(acc[cur.collective])) {
        acc[cur.collective].push(cur);
      } else {
        acc[cur.collective] = [cur];
      }

      return acc;
    }, {} as Record<string, ProposalData[]>);
  }, [allowedProposals]);

  const {
    changeTab: handleSelectCollective,
    currentTab: selectedCollective
  } = useTabs(Object.keys(_allowedProposals)[0]);

  return (
    <Tabs
      active={selectedCollective}
      onChange={handleSelectCollective}
    >
      {
        Object.keys(_allowedProposals).map((collective): JSX.Element => {
          return (
            <Tabs.Panel
              $key={collective}
              header={formatter(collective)}
              key={`proposal-module-list-${collective}`}
            >
              <ProposalsList>
                {
                  _allowedProposals[collective].map((proposal) => {
                    return (
                      <ProposalCard
                        data={proposal}
                        key={`proposal-card-${collective}-${proposal.name}-${proposal.section}`}
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
