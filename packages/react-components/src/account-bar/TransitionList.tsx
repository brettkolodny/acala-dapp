import React, { useMemo } from 'react';
import { ApiRx, Keyring } from '@polkadot/api';
import { FixedPointNumber } from '@acala-network/sdk-core';
import dayjs from 'dayjs';
import { Extrinsic } from '@acala-dapp/react-hooks/transactions-history/data-provider';
import { styled, Table } from '@acala-dapp/ui-components';
import type { BareProps } from '@acala-dapp/ui-components';
import { formatAddress } from '../utils';
import { useApi } from '@acala-dapp/react-hooks';

const renderTransitionTable1 = (data: Extrinsic): string => {
  if (data.section === 'currencies' && data.method === 'transfer') {
    const dest = data.params[0];
    const keyring = new Keyring();
    const address = keyring.addFromAddress('0x' + dest.value).address;

    return `To ${formatAddress(address)}`;
  }

  return '';
};

const renderTransitionTable2 = (data: Extrinsic): string => {
  if (data.section === 'currencies' && data.method === 'transfer') {
    const currencyId = data.params[1];
    const amount = data.params[2];

    return `${FixedPointNumber.fromInner(amount?.value).toNumber()} ${currencyId?.value?.Token}`;
  }

  return '';
};

interface TransitionListProps extends BareProps {
  data: Extrinsic[];
}

export const TransitionList = styled(({ className, data }: TransitionListProps) => {
  const columns = useMemo(() => ([
    {
      render: (item: Extrinsic): string => {
        return renderTransitionTable1(item);
      },
      title: 'Data'
    },
    {
      render: (item: Extrinsic): string => {
        return renderTransitionTable2(item);
      },
      title: 'Data'
    },
    {
      render: (item: Extrinsic): string => {
        return dayjs.unix(item.timestamp).format('YYYY/MM/DD HH:mm');
      },
      title: 'Data'
    }
  ]), []);

  return (
    <Table
      className={className}
      columns={columns}
      dataSource={data}
      pagination={false}
      showHeader={false}
    />
  );
})`
  & .ant-table {
    background: transparent;
    font-size: 16px;
    line-height: 1.1875;
    color: var(--text-color-second);
  }

  & td {
    padding: 14.5px;
  }

  & td:first-child {
    padding-left: 0;
  }

  & td:last-child {
    padding-right: 0;
  }

  & tr:last-child > td {
    border-bottom: none;
  }
`;
