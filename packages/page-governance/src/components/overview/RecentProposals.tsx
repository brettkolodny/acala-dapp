import React, { FC } from 'react';
import { useRecentProposals } from '@acala-dapp/react-hooks';
import { Row, Col, PageContentLoading } from '@acala-dapp/ui-components';
import { ProposalCard } from '../common/ProposalCard';

export const RecentProposals: FC = () => {
  const { data, loading } = useRecentProposals();

  return (
    <Row gutter={[24, 24]}>
      {
        loading ? <PageContentLoading />
          : data ? data.map((item) => {
            return (
              <Col
                key={item.hash}
                span={24}
              >
                <ProposalCard
                  {...item}
                  showGoToDetail
                />
              </Col>
            );
          }) : null
      }
    </Row>
  );
};
