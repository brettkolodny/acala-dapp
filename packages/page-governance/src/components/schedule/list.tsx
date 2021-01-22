import React, { FC, useMemo } from 'react';
import { usePageTitle } from '@acala-dapp/react-environment';
import { useScheduler } from '@acala-dapp/react-hooks';
import { Card, CardLoading, Col, Row, styled, List } from '@acala-dapp/ui-components';

import type { SchedulerData } from '@acala-dapp/react-hooks';
import type { BareProps } from '@acala-dapp/ui-components/types';
import { CallCard } from '../common/CallCard';
import { Empty } from '../common/Empty';
import { upperFirst } from 'lodash';

const Title = styled.p`
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: bold;

  &:before {
    content: '#';
    display: inline-block;
    margin-right: 4px;
    color: var(--color-primary);
  }
`;

const SchedulerCard = styled((
  { className, data }: { data: SchedulerData } & BareProps
) => {
  const periodic = useMemo(() => {
    const periodic = data.scheduler?.maybePeriodic.unwrapOrDefault();

    if (!periodic) return '';

    const [everyBlock, frequency] = periodic;

    return `every ${everyBlock.toNumber()} block, total ${frequency.toNumber()} times`;
  }, [data]);

  const title = useMemo(() => {
    const blockAt = data.blockAt;
    const name = data?.scheduler?.maybeId?.toHuman() as string;
    const section = data?.scheduler?.call?.section;
    const method = data?.scheduler?.call?.method;

    return `${blockAt} ${name || upperFirst(section) + ' ' + upperFirst(method)}`;
  }, [data]);

  return (
    <Card className={className}>
      <Title>{title}</Title>
      <List>
        <List.Item
          label='Name'
          value={data.scheduler?.maybeId?.toHuman() || '-'}
        />
        <List.Item
          label='Execute At'
          value={data.blockAt}
        />
        <List.Item
          label='Priority'
          value={data.scheduler?.priority?.toNumber() || '-'}
        />
        <List.Item
          label='Periodic'
          value={periodic}
        />
      </List>
      <CallCard data={data.scheduler?.call} />
    </Card>
  );
})`
  .aca-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 16px;
    column-gap: 32px;
  }

  .aca-list__item {
    align-items: flex-start;
  }

  .aca-list__item__label {
    color: var(--information-title-color);
  }

  .aca-list__item__value {
    work-break: break-all;
    padding-left: 32px;
    color: var(--information-content-color);
    text-align: right;
  }
`;

export const ScheduleList: FC = () => {
  const { data, loading } = useScheduler();

  usePageTitle({ content: 'Schedule' });

  return (
    <Row gutter={[24, 24]}>
      {
        loading && data.length === 0 ? (
          <CardLoading />
        ) : (
          data.length === 0 ? (
            <Col span={24}>
              <Empty description='No schedule yet' />
            </Col>
          ) : data.map((item, index) => (
            <Col
              key={`schedule-${index}`}
              span={24}
            >
              <SchedulerCard data={item} />
            </Col>
          ))

        )
      }
    </Row>
  );
};
