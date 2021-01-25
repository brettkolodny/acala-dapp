import React, { FC, useCallback } from 'react';
import { styled } from '@acala-dapp/ui-components';
import type { BareProps } from '@acala-dapp/ui-components';

type BlockBrowerLinkType = 'account' | 'extrinsic';

interface BlockBrowerLinkProps extends BareProps{
  type: BlockBrowerLinkType;
  data: Record<string, any>;
  linkProvider: (type: BlockBrowerLinkType, data: Record<string, any>) => string;
}

export const BlockBrowerLinkInner = styled(({ children, className, data, linkProvider, type }: BlockBrowerLinkProps) => {
  const goToLink = useCallback(() => {
    const link = linkProvider(type, data);

    window.open(link);
  }, [linkProvider, type, data]);

  return (
    <div
      className={className}
      onClick={goToLink}
    >
      {children}
    </div>
  );
})`
  cursor: pointer;
`;

export const SubscanLink: FC<Omit<BlockBrowerLinkProps, 'linkProvider'>> = ({ children, className, data, type }) => {
  const linkProvider = useCallback((type: BlockBrowerLinkProps['type'], data: BlockBrowerLinkProps['data']): string => {
    switch (type) {
      case 'account': {
        return `https://acala-testnet.subscan.io/account/${data?.account}`;
      }

      case 'extrinsic': {
        return `https://acala-testnet.subscan.io/extrinsic?address=${data?.account}&module=${data?.module}&call=${data?.call || 'call'}&signedChecked=signed%20only`;
      }
    }

    return '';
  }, []);

  return (
    <BlockBrowerLinkInner
      className={className}
      data={data}
      linkProvider={linkProvider}
      type={type}
    >
      {children}
    </BlockBrowerLinkInner>
  );
};
