import React from 'react';
import Identicon from '@polkadot/react-identicon';
import { styled } from '@acala-dapp/ui-components';
import type { BareProps } from '@acala-dapp/ui-components';
import { formatAddress } from './utils';

interface AccountProps extends BareProps {
  address?: string;
  icon: boolean;
  miniAddress?: boolean;
}

export const Account = styled(({ address, className, miniAddress, icon }: AccountProps) => {
  return (
    <div className={className}>
      {
        icon ? (
          <Identicon
            className='account__icon'
            value={address}
          />
        ) : null
      }
      <p className='account__address'>
        {formatAddress(address || '', miniAddress)}
      </p>
    </div>
  );
})`
  display: flex;
  align-items: center;

  & .account__icon {
    width: 16px;
    height: 16px;
    
    & svg {
      width: 16px;
      height: 16px;
    }

    margin-right: 14px;
  }

  & .account__address {
    font-size: 20px;
    line-height: 1.2;
    font-weight: 500;
  }
`;
