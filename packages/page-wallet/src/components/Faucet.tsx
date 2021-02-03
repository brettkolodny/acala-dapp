import React, { memo } from 'react';
import { BareProps, Button, styled } from '@acala-dapp/ui-components';
import { useFaucet, useTranslation } from '@acala-dapp/react-hooks';

const Faucet = styled(({ className }: BareProps) => {
  const { loading, run } = useFaucet('normal');
  const { t } = useTranslation('page-wallet');

  return (
    <Button
      className={className}
      loading={loading}
      onClick={run}
    >
      {t('Faucet')}
    </Button>
  );
})`
  // background: var(--color-green) !important;
`;

export default memo(Faucet);
