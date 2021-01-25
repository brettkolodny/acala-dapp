import React, { FC, memo, useMemo, useCallback } from 'react';

import { BareProps } from '@acala-dapp/ui-components/types';
import { Copy } from '@acala-dapp/ui-components';
import Identicon from '@polkadot/react-identicon';

import classes from './format.module.scss';
import { formatAddress } from '../utils';

interface Props extends BareProps {
  address: string;
  withFullAddress?: boolean;
  withMiniAddress?: boolean;
  copyIcon?: boolean;
  withIcon?: boolean;
  iconWidth?: number;
}

export const FormatAddress: FC<Props> = memo(({
  address,
  className,
  copyIcon = false,
  iconWidth = 22,
  withFullAddress = false,
  withIcon = false,
  withMiniAddress = false
}) => {
  const _address = useMemo<string>((): string => {
    if (withFullAddress) {
      return address;
    }

    if (!address) return '';

    return formatAddress(address, withMiniAddress);
  }, [address, withFullAddress, withMiniAddress]);

  const renderInner = useCallback(() => {
    return (
      <>
        {withIcon ? (
          <Identicon
            className={classes.icon}
            size={iconWidth}
            theme='polkadot'
            value={address}
          />
        ) : null }
        {_address}
      </>
    );
  }, [withIcon, _address, address, iconWidth]);

  if (copyIcon) {
    return (
      <Copy
        className={className}
        copyIcon={copyIcon}
        display='Copy Address Success'
        render={renderInner}
        text={address}
      />
    );
  }

  return renderInner();
});

FormatAddress.displayName = 'FormatAddress';
