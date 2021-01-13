import React, { FC, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { upperFirst } from 'lodash';

import { Card, Row, Col, styled, FlexBox, Button } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';
import { ProposalData } from '@acala-dapp/react-hooks';
import { CouncilsColor, CouncilType } from '../../config';
import { camelToDisplay } from './utils';

const Title = styled(({ className, council, title }: { title: string; council: string } & BareProps) => {
  const _council = useMemo(() => council.replace('Council', ''), [council]);
  const color = useMemo(() => CouncilsColor.get(_council as any as CouncilType), [_council]);

  return (
    <div className={className}>
      <p className='title__content'>{upperFirst(title)}</p>
      <p
        className='title__council'
        style={{ background: color?.backgroundActive }}
      >{_council}</p>
    </div>
  );
})`
  display: flex;

  .title__content {
    font-size: 16px;
    line-height: 1.1875;
    font-weight: 500;
  }

  .title__council {
    margin-left: 16px;
    font-size: 12px;
    line-height: 1.5;
    padding: 2px 8px;
    border-radius: 2px;
    color: #ffffff;
  }
`;

const Votes = styled(({ className, data }: { data: ProposalData['vote'] } & BareProps) => {
  return (
    <div className={className}>
      <p className='voted__title'>Votes</p>
      <div className='voted__content'>
        <div className='voted__content__count'>
          Aye {data.ayes.length}/{data.threshold.toNumber()}
        </div>
      </div>
    </div>
  );
})`
  .voted__title {
    font-size: 16px;
    line-height: 1;
    color: var(--text-color-second);
  }

  .voted__content {
    margin-top: 8px;
    line-height: 1.1875;
    color: var(--text-color-primary);
  }

  .voted__content__count {
    cursor: pointer;
  }
`;

const VoteEnd = styled(({ className, data }: { data: ProposalData['vote'] } & BareProps) => {
  return (
    <div className={className}>
      <p className='vote-end__title'>Voting Ends</p>
      <div className='vote-end__content'>
        <div className='vote-end__content'>
          <p>#{data.end.toString()}</p>
        </div>
      </div>
    </div>
  );
})`
  .vote-end__title {
    font-size: 16px;
    line-height: 1;
    color: var(--text-color-second);
  }

  .vote-end__content {
    margin-top: 8px;
    line-height: 1.1875;
    color: var(--text-color-primary);
  }
`;

const GotoDetailBtn: FC<{ council: string; hash: string }> = ({ council, hash }) => {
  const navigate = useNavigate();

  const goToDetail = useCallback(() => {
    navigate(`/governance/proposals/${council}-${hash}`);
  }, [navigate, council, hash]);

  return (
    <FlexBox justifyContent='flex-end'>
      <Button onClick={goToDetail}>
        Detail
      </Button>
    </FlexBox>
  );
};

const ProposalCardRoot = styled(Card)`
  .card__content {
    display: flex;
  }
`;

export const ProposalCard: FC<ProposalData & { showGoToDetail?: boolean }> = ({ council, hash, proposal, showGoToDetail, vote }) => {
  return (
    <ProposalCardRoot>
      <Row>
        <Col span={10}>
          <Title
            council={council}
            title={camelToDisplay(proposal.method.toString())}
          />
        </Col>
        <Col span={showGoToDetail ? 4 : 7}>
          <Votes data={vote} />
        </Col>
        <Col span={showGoToDetail ? 4 : 7}>
          <VoteEnd data={vote} />
        </Col>
        {
          showGoToDetail ? (
            <Col span={6}>
              <GotoDetailBtn
                council={council}
                hash={hash}
              />
            </Col>
          ) : null
        }
      </Row>
    </ProposalCardRoot>
  );
};
