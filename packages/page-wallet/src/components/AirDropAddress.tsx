import React, { FC, useCallback, useMemo } from 'react';

import { useAccounts } from '@acala-dapp/react-hooks';
import { tokenEq, convertAddress, formatAddress } from '@acala-dapp/react-components';
import { Copy, styled } from '@acala-dapp/ui-components';

interface Props {
  currency: string;
  type: 'toAddress' | 'relayChainAddress';
}

const Capitalize = styled.span`
  text-transform: capitalize;
`;

export const AirDropAddress: FC<Props> = ({ currency, type }) => {
  const { active } = useAccounts();
  const account = active ? active.address : '';

  const [network, address, shortAddress] = useMemo(() => {
    let network: 'karura' | 'acala' | 'kusama' | 'polkadot' | undefined;

    if (type === 'toAddress') {
      if (tokenEq(currency, 'ACA')) {
        network = 'acala';
      } else if (tokenEq(currency, 'KAR')) {
        network = 'karura';
      }
    } else if (type === 'relayChainAddress') {
      if (tokenEq(currency, 'ACA')) {
        network = 'polkadot';
      } else if (tokenEq(currency, 'KAR')) {
        network = 'kusama';
      }
    }

    if (!network) return [];

    const address = convertAddress(account, network);
    const shortAddress = formatAddress(address);

    return [network, address, shortAddress];
  }, [account, currency, type]);

  const renderInner = useCallback(() => {
    return (
      <>
        <Capitalize>{network} address</Capitalize>: {shortAddress}
      </>
    );
  }, [network, shortAddress]);

  if (!network || !address || !shortAddress) {
    return null;
  }

  return (
    <Copy
      // className={className}
      display='Copy Address Success'
      render={renderInner}
      text={address}
    />
  );
};
