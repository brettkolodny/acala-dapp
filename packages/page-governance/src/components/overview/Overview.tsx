import React, { FC, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router';

import { ArrowPixelIcon, Row, Col, styled, SubTitle } from '@acala-dapp/ui-components';

import { BareProps, ClickAbleProps } from '@acala-dapp/ui-components/types';
import { usePageTitle } from '@acala-dapp/react-environment';

import { CouncilesTab } from '../common/CouncliTab';
import { GovernanceStage } from './GovernanceStage';
import { GovernanceIntro } from './GovernanceIntro';
import { RecentProposals } from './RecentProposals';
import { CouncilMembers } from '../council/CouncilMembers';
import { CouncilType } from '../../config';
import { GovernanceContext } from '../Provider';

const OverviewSubTitleExtra = styled<FC<{ content: string } & BareProps & ClickAbleProps >>(({ className, content, onClick }) => {
  return (
    <div
      className={className}
      onClick={onClick}
    >
      {content}
      <ArrowPixelIcon />
    </div>
  );
})`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--color-primary);
  user-select: none;
  cursor: pointer;

  > svg {
    margin-left: 16px;
    height: 14px;
  }
`;

export const Overview: FC = () => {
  const { changeTab } = useContext(GovernanceContext);

  const goToCouncilDetailPage = useCallback(() => {
    changeTab('council');
  }, [changeTab]);

  const goToAllProposals = useCallback(() => {
    changeTab('proposal');
  }, [changeTab]);

  const memberRender = useCallback((council: CouncilType) => <CouncilMembers council={council} />, []);

  // set page title
  usePageTitle({ content: 'Governance Overview' });

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <GovernanceStage />
      </Col>
      <Col span={24}>
        <SubTitle
          extra={
            <OverviewSubTitleExtra
              content='View All Proposals'
              onClick={goToAllProposals}
            />
          }
        >
          Recent Council Proposals
        </SubTitle>
        <RecentProposals />
      </Col>
      <Col span={24}>
        <SubTitle
          extra={
            <OverviewSubTitleExtra
              content='View All Councils'
              onClick={goToCouncilDetailPage}
            />
          }
        >
          Councils
        </SubTitle>
        <CouncilesTab contentRender={memberRender} />
      </Col>
      <Col span={24}>
        <GovernanceIntro />
      </Col>
    </Row>
  );
};
