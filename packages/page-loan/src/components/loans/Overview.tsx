import React, { FC, useContext, ReactNode, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';

import { DerivedUserLoan } from '@acala-network/api-derive';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Card, ColumnsType, Table, Button, Step, styled, FlexBox } from '@acala-dapp/ui-components';
import { useConstants, useAllUserLoans, useTranslation } from '@acala-dapp/react-hooks';
import { Token, getTokenName, StableFeeAPR, CollateralRate, Collateral, DebitAmount } from '@acala-dapp/react-components';
import { ReactComponent as GuideBG } from '../../assets/guide-bg.svg';

import { LoanContext } from './LoanProvider';

const CGuideBG = styled(GuideBG)`
  margin: 40px 0 27px 0;
`;

const GuideRoot = styled(Card)`
  .card__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const CStep = styled(Step)`
  width: 100%;
`;

export const Guide: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('page-loan');
  const stepConfig = useMemo(() => [
    { index: 'select', text: t('Select Collateral') },
    { index: 'generate', text: t('Generate aUSD') },
    { index: 'confirm', text: t('Confirm') }
  ], [t]);

  const goToCreate = useCallback((): void => {
    navigate('create');
  }, [navigate]);

  return (
    <GuideRoot>
      <CStep
        config={stepConfig}
        current={'select'}
      />
      <CGuideBG />
      <Button
        onClick={goToCreate}
        size='small'
      >
        {t('Get Started')}
      </Button>
    </GuideRoot>
  );
};

const ManagerBtn: FC<{ currency: CurrencyId; onClick: (currency: CurrencyId) => void }> = ({ currency, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(currency);
  }, [onClick, currency]);
  const { t } = useTranslation('page-loan');

  return (
    <FlexBox
      alignItems='center'
      justifyContent='flex-end'
    >
      <Button
        onClick={handleClick}
        size='small'
      >
        {t('Manage')}
      </Button>
    </FlexBox>
  );
};

export const Overview: FC = () => {
  const loans = useAllUserLoans(true);
  const { selectCurrency } = useContext(LoanContext);
  const { stableCurrency } = useConstants();
  const { t } = useTranslation('page-loan');

  const tableConfig: ColumnsType<DerivedUserLoan> = [
    {
      align: 'left',
      dataIndex: 'currency',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => (
        <Token
          currency={token}
          icon
        />
      ),
      title: t('Token'),
      width: 1
    },
    {
      align: 'left',
      key: 'interest-rate',
      /* eslint-disable-next-line react/display-name */
      render: ({ currency }): ReactNode => <StableFeeAPR currency={currency} />,
      title: t('Interest Rate'),
      width: 1
    },
    {
      align: 'right',
      key: 'deposit',
      /* eslint-disable-next-line react/display-name */
      render: ({ currency }): ReactNode => <Collateral currency={currency} />,
      title: t('Deposit'),
      width: 1
    },
    {
      align: 'right',
      key: 'debit',
      /* eslint-disable-next-line react/display-name */
      render: ({ currency }): ReactNode => <DebitAmount currency={currency} />,
      title: t('Debit {{token}}', { token: getTokenName(stableCurrency.asToken.toString()) }),
      width: 2
    },
    {
      align: 'right',
      key: 'current-ratio',
      /* eslint-disable-next-line react/display-name */
      render: ({ currency }): ReactNode => <CollateralRate currency={currency} />,
      title: t('Current Ratio'),
      width: 2
    },
    {
      align: 'right',
      key: 'action',
      /* eslint-disable-next-line react/display-name */
      render: ({ currency }): ReactNode => (
        <ManagerBtn
          currency={currency}
          onClick={selectCurrency}
        />
      ),
      title: t('Action'),
      width: 2
    }
  ];

  if (!loans) return null;

  if (loans && loans.length === 0) return <Guide />;

  return (
    <Card
      header={t('Overview')}
      padding={false}
    >
      <Table
        columns={tableConfig}
        dataSource={loans}
        pagination={false}
        rowKey={'currency'}
      />
    </Card>
  );
};
