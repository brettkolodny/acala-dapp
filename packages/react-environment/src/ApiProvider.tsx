import React, { ReactNode, FC, useState, useEffect, useCallback, useRef } from 'react';
import { Subscription } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { ApiRx, WsProvider } from '@polkadot/api';
import { options } from '@acala-network/api';

const MAX_CONNECT_TIME = 1000 * 60; // one minute

export interface ApiContextData {
  api: ApiRx;
  connected: boolean;
  error: boolean;
  loading: boolean;
  chainInfo: {
    chainName: string;
  };
  properties: {
    ss58Format: string;
    tokenDecimals: number;
    tokenSymbol: string;
  };
  init: (endpoint: string, allEndpoint: string[]) => void; // connect to network
}

// ensure that api always exist
export const ApiContext = React.createContext<ApiContextData>({} as ApiContextData);

interface Props {
  children: ReactNode;
}


/**
 * @name ApiProvider
 * @description context provider to support initialized api and chain information
 */
export const ApiProvider: FC<Props> = ({
  children
}) => {
  // api instance
  const [api, setApi] = useState<ApiRx>({} as ApiRx);

  // chain information
  const [chainName, setChainName] = useState<string>('');

  // chain properties
  const [properties, setProperties] = useState<ApiContextData['properties']>({
    ss58Format: '',
    tokenDecimals: 18,
    tokenSymbol: 'ACA'
  });

  // status
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const apiSubscriber = useRef<Subscription>();

  const init = useCallback((endpoint: string, allEndpoints: string[]) => {
    if (apiSubscriber.current) return;

    const provider = new WsProvider([endpoint, ...allEndpoints]);

    apiSubscriber.current = ApiRx.create(options({ provider })).pipe(
      timeout(MAX_CONNECT_TIME)
    ).subscribe({
      error: (): void => {
        setConnected(false);
        setError(true);
        setLoading(false);
      },
      next: (result): void => {
        setApi(result);
        setConnected(true);
        setError(false);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!connected) return;

    console.log(api);

    api.rpc.system.chain().subscribe((result) => {
      setChainName(result.toString());
    });

    api.rpc.system.properties().subscribe((result) => {
      setProperties({
        ss58Format: result.ss58Format.unwrapOrDefault().toString(),
        tokenDecimals: result.tokenDecimals.unwrapOrDefault().toNumber(),
        tokenSymbol: result.tokenSymbol.unwrapOrDefault().toString()
      });
    });
  }, [api, connected]);

  useEffect(() => {
    if (!connected) return;

    api.on('disconnected', () => {
      setConnected(false);
      setError(false);
    });
    api.on('error', () => {
      setConnected(false);
      setError(true);
    });
    api.on('connected', () => {
      setConnected(true);
      setError(false);
    });
  }, [api, connected, error]);

  return (
    <ApiContext.Provider
      value={{
        api,
        chainInfo: {
          chainName
        },
        connected,
        error,
        init,
        loading,
        properties
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
