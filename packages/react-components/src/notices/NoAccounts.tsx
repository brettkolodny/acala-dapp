import React, { FC, memo } from 'react';
import { Dialog } from '@acala-dapp/ui-components';

export const NoAccounts: FC = memo(() => {
  const handleRetry = (): void => window.location.reload();

  return (
    <Dialog
      cancelText={undefined}
      confirmText='Retry'
      onConfirm={handleRetry}
      title={null}
      visible={true}
    >
      <p>
        No account found, please add account in your wallet extension or unlock it!
      </p>
    </Dialog>
  );
});

NoAccounts.displayName = 'NoAccounts';
