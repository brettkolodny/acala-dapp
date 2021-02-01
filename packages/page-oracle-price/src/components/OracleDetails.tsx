import React, { FC, useEffect, useMemo } from 'react';

import { FixedPointNumber } from '@acala-network/sdk-core';

import { Card, styled, Table, ColumnsType } from '@acala-dapp/ui-components';
import { useStore } from '@acala-dapp/react-environment';
import { OracleProvider } from '@acala-dapp/react-environment/store/modules/oracle-prices';
import { useMemState } from '@acala-dapp/react-hooks';

import { FormatPrice, getTokenName } from '@acala-dapp/react-components';

import { TimeChange } from './OracleAggregated';

const CTimeChange = styled(TimeChange)`
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.166667;
`;

const TimeChangePlaceholder = styled.div`
  margin-top: 4px;
  height: 14px;
`;

const TokenName = styled.p`
  margin-right: 108px;
  margin-bottom: 18px;
  font-size: 16px;
  line-height: 1.166667;
  font-weight: var(--text-weight-md);
  color: var(--text-color-primary);
  text-align: left;
`;

const Price = styled(FormatPrice)<{ isHighest: boolean }>`
  height: 20px;
  padding: 0 12px;
  margin-left: -12px;
  border-radius: 10px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ isHighest }): string => isHighest ? '#6A0CDC' : '#000000'};
  background: ${({ isHighest }): string => isHighest ? '#faf6fe' : 'transparent'};
  transition: color, background .2s ease-in-out;
`;

interface PriceWithChangeProps {
  price: FixedPointNumber;
  isHighest: boolean;
  updateAt?: Date;
}

const PriceWithChange: FC<PriceWithChangeProps> = ({ isHighest, price, updateAt }) => {
  const [latestPrice, setLatestPrice] = useMemState<FixedPointNumber>(FixedPointNumber.ZERO);

  useEffect(() => {
    if (!price) return;

    if (price.toString() !== latestPrice.toString()) {
      setLatestPrice(price);
    }
  }, [price, setLatestPrice, latestPrice]);

  return (
    <div>
      <Price
        data={price}
        isHighest={isHighest}
        prefix='$'
      />
      {
        isHighest
          ? <CTimeChange latest={updateAt?.getTime() || 0} />
          : <TimeChangePlaceholder />
      }
    </div>
  );
};

export const OracleDetails: FC = () => {
  const oraclePrices = useStore('oraclePrices');
  const data = useMemo(() => {
    const result: Record<string, any>[] = [];

    Object.keys(oraclePrices).forEach((provider) => {
      const data = oraclePrices[provider as OracleProvider];

      data.forEach((item) => {
        const temp = result.find((resultItem) => resultItem.currency === item.currency);

        if (temp) {
          if (item.price.isGreaterThanOrEqualTo((temp.highest || FixedPointNumber.ZERO) as FixedPointNumber)) {
            temp.highest = item.price;
          }

          temp[provider] = {
            price: item.price,
            timestamp: item.timestamp
          };
        } else {
          result.push({
            currency: item.currency,
            highest: item.price,
            [provider]: {
              price: item.price,
              timestamp: item.timestamp
            }
          });
        }
      });
    });

    return result;
  }, [oraclePrices]);

  const columns = useMemo((): ColumnsType<any> => {
    const providers: string[] = (Object.keys(oraclePrices) as unknown as string[]).sort((item) => item === 'Aggregated' ? -1 : 1);

    return [
      {
        align: 'left',
        key: 'name',
        /* eslint-disable-next-line react/display-name */
        render: (data: any): JSX.Element => <TokenName>{getTokenName(data.currency)}</TokenName>,
        title: ''
      },
      ...providers.map((item) => {
        return {
          align: 'left',
          key: item,
          /* eslint-disable-next-line react/display-name */
          render: (data: any): JSX.Element => (
            <PriceWithChange
              isHighest={
                (data[item]?.price) &&
                (data.highest as FixedPointNumber).isEqualTo(data[item].price)
              }
              price={data[item]?.price}
              updateAt={data[item]?.timestamp}
            />
          ),
          title: item
        };
      }) as ColumnsType
    ];
  }, [oraclePrices]);

  return (
    <Card
      overflowHidden={true}
      padding={false}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowClassName='striped'
      />
    </Card>
  );
};
