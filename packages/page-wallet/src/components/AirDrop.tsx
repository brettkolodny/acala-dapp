import React, { FC, useMemo } from 'react';

import { Card, ColumnsType, Table, FlexBox } from '@acala-dapp/ui-components';
import { useApi } from '@acala-dapp/react-hooks';
import { tokenEq, AirDropAmount } from '@acala-dapp/react-components';
import { AirDropCurrencyId } from '@acala-network/types/interfaces';

import { AirDropAddress } from './AirDropAddress';

export const AirDrop: FC = () => {
  const { api } = useApi();
  const airdropTypes = useMemo(() => {
    if (!api) return [];

    return (api.registry.createType('AirDropCurrencyId' as any) as AirDropCurrencyId).defKeys.map((key) => {
      return { token: key };
    });
  }, [api]);

  const tableConfig: ColumnsType<{ token: string }> = [
    {
      align: 'left',
      dataIndex: 'token',
      key: 'token',
      render: (token: string): string => tokenEq(token, 'ACA') ? `${token} (Mainnet)` : token,
      title: 'Token'
    },
    {
      align: 'left',
      dataIndex: 'token',
      key: 'toAddress',
      /* eslint-disable-next-line react/display-name */
      render: (token: string): JSX.Element => <AirDropAddress currency={token}
        type='toAddress' />,
      title: 'To Address'
    },
    {
      align: 'left',
      dataIndex: 'token',
      key: 'relayChainAddress',
      /* eslint-disable-next-line react/display-name */
      render: (token: string): JSX.Element => <AirDropAddress currency={token}
        type='relayChainAddress' />,
      title: 'Relay Chain Address'
    },
    {
      align: 'right',
      key: 'balance',
      /* eslint-disable-next-line react/display-name */
      render: ({ token }): JSX.Element => <AirDropAmount currency={token} />,
      title: 'Balance'
    }
  ];

  return (
    <Card
      header={
        <FlexBox justifyContent='space-between'>
          <p>AirDrop</p>
        </FlexBox>
      }
      padding={false}
    >
      <Table
        columns={tableConfig}
        dataSource={airdropTypes}
        pagination={false}
        rowKey='token'
      />
    </Card>
  );
};
