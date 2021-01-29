/* eslint-disable sort-keys */
export type EndpointType = 'testnet' | 'production' | 'development';

export interface EndpointConfigItem {
  name: string;
  url: string;
}

export type EndpointConfig = Record<EndpointType, EndpointConfigItem[]>;

export const DEFAULT_ENDPOINTS: EndpointConfig = {
  production: [],
  testnet: [
    // {
    //   name: 'Rococo Mandala',
    //   url: 'wss://rococo-demo-acala.phala.network/ws'
    // },
    {
      name: 'Mandala TC6-1',
      url: 'wss://mandala.laminar.codes/ws'
    }
  ],
  development: [
    {
      name: 'Local',
      url: 'ws://127.0.0.1:9944'
    }
  ]
};
