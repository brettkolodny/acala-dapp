import React, { useMemo } from 'react';
import styled from 'styled-components';

import { BareProps, List } from '@acala-dapp/ui-components';
import { formatCodec } from '@acala-dapp/react-components';
import type { Call } from '@polkadot/types/interfaces/runtime';

import { camelToDisplay } from './utils';

export const CallCard = styled(({ className, data }: { data: Call } & BareProps) => {
  const args = useMemo(() => {
    const _args = data?.meta?.args?.toArray();

    return _args.map((item, index) => {
      return {
        label: item.name.toString(),
        type: item.type.toString(),
        value: data?.args[index]
      };
    });
  }, [data]);

  return (
    <div className={className}>
      <List>
        <List.Item
          label='Section'
          value={data.section}
        />
        <List.Item
          label='Method'
          value={data.method}
        />
        {
          args.map((item) => {
            return (
              <List.Item
                key={`${item.label}-${item.value.toString()}`}
                label={camelToDisplay(item.label)}
                value={formatCodec(item.type, item.value)}
              />
            );
          })
        }
      </List>
    </div>
  );
})`
  margin: 0 -24px -24px -24px;
  background: var(--information-background);
  border-radius: 12px;
  padding: 24px;
`;
