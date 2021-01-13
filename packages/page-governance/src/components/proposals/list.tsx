import React, { FC, useCallback } from 'react';
import { usePageTitle } from '@acala-dapp/react-environment';
import { useProposals } from '@acala-dapp/react-hooks';
import { Card, CardLoading, Col, Row, styled } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';
import { CouncilType } from '../../config';
import { ProposalCard } from '../common/ProposalCard';
import { CouncilesTab } from '../common/CouncliTab';

const EmptyProposal = styled(({ className }: BareProps) => {
  return (
    <Card className={className}>
      No Proposals
    </Card>
  );
})`
  font-size: 24px;
  font-weight: 500;
`;

const ProposalList: FC<{ council: string }> = ({ council }) => {
  const { data: proposals, loading } = useProposals(council);

  return (
    <Row gutter={[24, 24]}>
      {
        loading ? <CardLoading />
          : (proposals && proposals.length)
            ? proposals.map((item, index) => (
              <Col
                key={`proposal-${item.council}-${index}`}
                span={24}
              >
                <ProposalCard
                  {...item}
                  showGoToDetail
                />
              </Col>
            ))
            : (
              <Col span={24}>
                <EmptyProposal />
              </Col>
            )
      }
    </Row>
  );
};

export const AllProposalList: FC = () => {
  usePageTitle({
    breadcrumb: [
      {
        content: 'Governance Overview',
        path: '/governance'
      }
    ],
    content: 'Council Proposals'
  });
  const councilRender = useCallback((council: CouncilType) => <ProposalList council={council} />, []);

  return (
    <CouncilesTab contentRender={councilRender} />
  );
};
