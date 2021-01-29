import React, { memo } from 'react';
import { BareProps, Button, styled } from '@acala-dapp/ui-components';
import { useFaucet } from '@acala-dapp/react-hooks';

const Faucet = styled(({ className }: BareProps) => {
  const { loading, run } = useFaucet('normal');

  return (
    <Button
      className={className}
      loading={loading}
      onClick={run}
    >
      Faucet
    </Button>
  );
})`
  // background: var(--color-green) !important;
`;

export default memo(Faucet);
