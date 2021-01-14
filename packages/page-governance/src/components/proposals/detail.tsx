import React, { FC, useCallback, useMemo } from 'react';
import { AccountId } from '@acala-network/types/interfaces';
import { useParams } from 'react-router';
import { usePageTitle } from '@acala-dapp/react-environment';
import { ProposalData, useAccounts, useApi, useCouncilMembers, useProposal } from '@acala-dapp/react-hooks';
import { Card, Col, FlexBox, List, notification, Row, styled } from '@acala-dapp/ui-components';
import { ProposalCard } from '../common/ProposalCard';
import { camelToDisplay } from '../common/utils';
import { BareProps } from '@acala-dapp/ui-components/types';
import { FormatAddress, TxButton } from '@acala-dapp/react-components';

const Arguments = styled.div`
  padding: 16px;
  font-size: 16px;
  line-height: 1.1875;
  color: var(--text-color-second);
  border: 1px solid #cccccc;
`;

const VoteItem = styled(({ allCouncil, className, data, type }: { type: 'ayes' | 'nays'; data: AccountId[]; allCouncil: number } & BareProps) => {
  return (
    <div className={className}>
      <FlexBox
        alignItems='center'
        className='vote-item__title'
        justifyContent='space-between'
      >
        <span>{type === 'ayes' ? 'For' : 'Against'}</span>
        <span>{data.length || 0}</span>
      </FlexBox>
      <div className='vote-item__process-bar'>
        <div
          className='vote-item__process-bar__content'
          style={{ width: data.length / allCouncil * 100 + '%' }}
        />
      </div>
      <ul className='vote-item__account-list'>
        {
          data.map((item): JSX.Element => (
            <li
              className='vote-item__account-list__item'
              key={`vote-item-account-list-${item.toString()}`}
            >
              <FormatAddress address={item.toString()} />
            </li>
          ))
        }
      </ul>
    </div>
  );
})`
width: 320px;
margin-right: 45px;

.vote-item__title {
  font-weight: 500;
  font-size: 16px;
  line-height: 1.1875;
}

.vote-item__process-bar {
  margin-top: 20px;
  position: relative;
  width: 100%;
  height: 4px;
  background: #dfe1e4;

  &__content {
    position: absolute;
    height: 4px;
    background: var(--color-primary);
  }
}

.vote-item__account-list {
  margin-top: 24px;
  list-style: none;
}

.vote-item__account-list__item {
  padding: 16px 0;
  font-size: 16px;
  line-height: 1.1875;
  color: var(--text-color-second);
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }
}
`;

const VoteDetail = styled(({ className, council, vote }: ProposalData & BareProps) => {
  const members = useCouncilMembers(council);

  return (
    <Card
      contentClassName={className}
      header='Vote Detail'
    >
      <FlexBox alignItems='flex-start'>
        <VoteItem
          allCouncil={vote.threshold.toNumber()}
          data={vote.ayes}
          type='ayes'
        />
        <VoteItem
          allCouncil={members?.length || 0}
          data={vote.nays}
          type='nays'
        />
      </FlexBox>
    </Card>
  );
})`
padding-top: 24px;

.vote-detail__title {
  font-weight: 500;
  font-size: 16px;
  line-height: 1.1875;
}

.vote-detail__item {
  width: 320px;
  margin-right: 45px;
}
`;

const OnChainInfo = styled(({ className, council, proposal, vote }: ProposalData & BareProps) => {
  return (
    <Card
      className={className}
      header='On Chain Info'
    >
      <List>
        <List.Item
          label='Proposal'
          value={proposal.sectionName + ' / ' + proposal.methodName}
        />
        <List.Item
          label='Council'
          value={council}
        />
        <List.Item
          label='Threshold'
          value={vote.threshold.toNumber()}
        />
      </List>
      <p className='on-chain-info__sub-title'>Arguments</p>
      <Arguments>
        {JSON.stringify(proposal.toHuman())}
      </Arguments>
    </Card>
  );
})`
.on-chain-info__sub-title {
  margin: 16px 0 12px 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.1875;
  color: var(--text-color-primary);
}

.aca-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.aca-list__item {
  display: block;
}

.aca-list__item__label {
  font-weight: 500;
  font-size: 16px;
  line-height: 1.1875;
  color: var(--text-color-primary);
}

.aca-list__item__value {
  margin-top: 12px;
  font-size: 16px;
  line-height: 1.1875;
  color: var(--text-color-second);
}
`;

const ActionBar = styled(({ council, hash, proposal, vote }: ProposalData & BareProps) => {
  const { active } = useAccounts();
  const members = useCouncilMembers(council);
  const { api } = useApi();
  const ayeCall = useMemo(() => {
    return api.tx[council].vote(
      hash,
      vote.index,
      true
    );
  }, [api, hash, vote, council]);

  const nayCall = useMemo(() => {
    return api.tx[council].vote(
      hash,
      vote.index,
      false
    );
  }, [api, hash, vote, council]);

  const closeCall = useMemo(() => {
    return api.tx[council].close(
      hash,
      vote.index,
      2 ** 32,
      proposal.toU8a().length
    );
  }, [api, hash, vote, council, proposal]);

  const canAccess = useMemo(() => {
    if (!members) return false;
    if (!active) return false;

    return members.find((item: AccountId): boolean => item.toString() === active.address)?.length !== 0;
  }, [active, members]);

  const onAyeSuccess = useCallback(() => {
    notification.success({
      message: 'Aye Proposal Success'
    });
  }, []);

  const onNaySuccess = useCallback(() => {
    notification.success({
      message: 'Nay Proposal Success'
    });
  }, []);

  const onCloseSuccess = useCallback(() => {
    notification.success({
      message: 'Close Proposal Submit Success'
    });
  }, []);

  return (
    <Row
      gutter={[24, 24]}
      justify='end'
    >
      {
        canAccess ? (
          <Col>
            <TxButton
              call={ayeCall}
              onExtrinsicSuccsss={onAyeSuccess}
            >
              Approve
            </TxButton>
          </Col>
        ) : null
      }
      {
        canAccess ? (
          <Col>
            <TxButton
              call={nayCall}
              onExtrinsicSuccsss={onNaySuccess}
            >
              Against
            </TxButton>
          </Col>
        ) : null
      }
      <Col>
        <TxButton
          call={closeCall}
          onExtrinsicSuccsss={onCloseSuccess}
        >
          Close
        </TxButton>
      </Col>
    </Row>
  );
})`
`;

export const ProposalDetail: FC = () => {
  const params = useParams();
  const [council, hash] = params.id ? params.id.split('-') : [];
  const data = useProposal(council, hash);

  usePageTitle({
    breadcrumb: [
      {
        content: 'Governance Overview',
        path: '/governance'
      },
      {
        content: 'Council Proposals',
        path: '/governance/proposals'
      }
    ],
    content: data ? camelToDisplay(data.proposal.method) : ''
  });

  if (!data) return null;

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <ProposalCard
          {...data}
          showGoToDetail={false}
        />
      </Col>
      <Col span={24}>
        <OnChainInfo {...data} />
      </Col>
      <Col span={24}>
        <VoteDetail {...data} />
      </Col>
      <Col span={24}>
        <ActionBar {...data} />
      </Col>
    </Row>
  );
};
