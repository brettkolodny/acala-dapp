import React, { memo, useCallback } from 'react';
import { Dialog } from '@acala-dapp/ui-components';

const POLKADOT_EXTENSION_PAGE = 'https://polkadot.js.org/extension';

export const NoExtensions: React.FC = memo(() => {
  const handleGetExtensionBtnClick = useCallback((): void => {
    window.open(POLKADOT_EXTENSION_PAGE);
  }, []);

  return (
    <Dialog
      cancelText={undefined}
      confirmText='GET IT'
      onConfirm={handleGetExtensionBtnClick}
      title={null}
      visiable={true}
    >
      <p>{'No polkadot{.js} extension found, please install it first!'}</p>
    </Dialog>
  );
});

NoExtensions.displayName = 'NoExtensions';
