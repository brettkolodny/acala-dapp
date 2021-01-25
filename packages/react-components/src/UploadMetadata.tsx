import { Dialog, Typology } from '@acala-dapp/ui-components';
import React, { FC } from 'react';

interface UploadMetadataProps {
  uploadMetadata: () => Promise<void>;
  visible: boolean;
  close: () => void;
}

export const UploadMetadata: FC<UploadMetadataProps> = ({
  close,
  uploadMetadata,
  visible
}) => {
  return (
    <Dialog
      cancelText={'Cancel'}
      confirmText={'Upload'}
      onCancel={close}
      onConfirm={uploadMetadata}
      showCancel={true}
      visible={visible}
    >
      <Typology.Body>Upload metadata for best experience.</Typology.Body>
    </Dialog>
  );
};
