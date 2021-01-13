import React, { FC, useCallback, useContext, useMemo } from 'react';
import clsx from 'clsx';
import { Button, FlexBox, styled, Tabs, useTabs } from '@acala-dapp/ui-components';
import { ClickAbleProps } from '@acala-dapp/ui-components/types';
import { useModal } from '@acala-dapp/react-hooks';

import { ProposalData, CreateContext } from './CreateProvider';
import { formatter } from '../../config';

const ProposalsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
`;

const ProposalCard = styled((props: ProposalData & ClickAbleProps) => {
  const { className, collective, document, name, onClick } = props;
  const { onSelectProposal, selectedProposal } = useContext(CreateContext);

  const handleClick = useCallback(() => {
    onSelectProposal(props);
    onClick();
  }, [onSelectProposal, props, onClick]);

  const isActive = useMemo(() => {
    return selectedProposal &&
      selectedProposal.name === name &&
      selectedProposal.collective === collective;
  }, [name, collective, selectedProposal]);

  return (
    <div
      className={clsx(className, { active: isActive })}
      onClick={handleClick}
    >
      <p className='proposal-card__name'>{formatter(name)}</p>
      <p className='proposal-card__document'>{document}</p>
    </div>
  );
})<ProposalData & ClickAbleProps>`
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

const SelectedProposal = styled(({ className, onClick }: ClickAbleProps) => {
  const { selectedProposal } = useContext(CreateContext);

  return (
    <FlexBox
      alignItems='center'
      className={className}
      justifyContent='space-between'
    >
      <p className='selected-proposal__proposal'>
        {`${formatter(selectedProposal?.section)} / ${formatter(selectedProposal?.name)}`}
      </p>
      <Button
        className='selected-proposal__change-btn'
        onClick={onClick}
        style='primary'
        type='ghost'
      >
        Change
      </Button>
    </FlexBox>
  );
})`
  .selected-proposal__proposal {
    font-size: 18px;
    font-weight: bold;
    color: var(--information-title-color);
  }

  .selected-proposal__change-btn {
    justify-content: flex-end;
    padding-right: 0;
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
    changeTabs: handleSelectCollective,
    currentTab: selectedCollective
  } = useTabs(Object.keys(_allowedProposals)[0]);

  const {
    close: closeSelector,
    open: showSelector,
    status: selectorStatus
  } = useModal(true);

  if (selectorStatus) {
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
                key={`proposal-module-list-${module}`}
              >
                <ProposalsList>
                  {
                    _allowedProposals[collective].map((proposal) => {
                      return (
                        <ProposalCard
                          key={`proposal-card-${module}-${proposal.name}`}
                          onClick={closeSelector}
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
  } else {
    return <SelectedProposal onClick={showSelector} />;
  }
};
