import React, { FC, useCallback } from 'react';
import { usePageTitle } from '@acala-dapp/react-environment';
import { useProposals } from '@acala-dapp/react-hooks';
import { Button, CardLoading, Col, FlexBox, PlusOutlined, Row } from '@acala-dapp/ui-components';
import { CouncilType } from '../../config';
import { ProposalCard } from '../common/ProposalCard';
import { CouncilesTab } from '../common/CouncliTab';
import { Empty } from '../common/Empty';

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
                <Empty description='No proposal yet' />
              </Col>
            )
      }
    </Row>
  );
};

export const AllProposalList: FC = () => {
  usePageTitle({ content: 'Proposals' });

  const councilRender = useCallback((council: CouncilType) => <ProposalList council={council} />, []);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <FlexBox justifyContent='flex-end'>
          <Button size='middle'>
            <PlusOutlined />
            Create Proposal
          </Button>
        </FlexBox>
      </Col>
      <Col span={24}>
        <CouncilesTab contentRender={councilRender} />
      </Col>
    </Row>
  );
};
