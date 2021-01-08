import React, { FC, useContext, useMemo } from 'react';
import { useAllCouncilMembers } from '@acala-dapp/react-hooks';
import { List, styled } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';
import { CreateContext } from './CreateProvider';
import { formatter } from '../../config';

export const CouncilAndProposal: FC = styled(({ className }: BareProps) => {
  const { selectedProposal } = useContext(CreateContext);
  const { members } = useAllCouncilMembers();

  const usedCouncil = useMemo(() => {
    return members.filter((item): boolean => item.council === selectedProposal?.origin.council)[0];
  }, [members, selectedProposal]);

  const requiredSet = useMemo(() => {
    if (!selectedProposal || !usedCouncil) return 0;

    const { origin: { denominator, numerator } } = selectedProposal;
    const councilMemberLength = usedCouncil.data.length;

    return Math.ceil(councilMemberLength * numerator / denominator);
  }, [usedCouncil, selectedProposal]);

  return (
    <div className={className}>
      <List>
        <List.Item
          label='Proposal'
          value={formatter(selectedProposal?.name || '')}
        />
        <List.Item
          label='Module'
          value={formatter(selectedProposal?.module || '')}
        />
        <List.Item
          label='Description'
          value={formatter(selectedProposal?.document || '')}
        />
        <List.Item
          label='Council'
          value={formatter(usedCouncil?.council || '')}
        />
        <List.Item
          label='Council Members'
          value={usedCouncil?.data.length || 0}
        />
        <List.Item
          label='Approved Minimum Threshold'
          value={requiredSet}
        />
      </List>
    </div>
  );
})`
  color: var(--text-color-primary);

  .aca-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .aca-list__item {
    align-items: flex-start;
    margin-top: 16px;
    padding: 16px;
    border-left: 1px solid var(--border-color);
  }

  .aca-list__item:nth-child(2n + 1) {
    border-left: none;
  }

  .aca-list__item__label {
    color: var(--information-title-color);
  }

  .aca-list__item__value {
    padding-left: 32px;
    color: var(--information-content-color);
    text-align: right;
  }
`;
