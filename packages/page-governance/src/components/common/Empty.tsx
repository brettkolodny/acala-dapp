import React from 'react';
import { styled, Card, Empty as UIEmpty } from '@acala-dapp/ui-components';
import type { BareProps } from '@acala-dapp/ui-components';

export const Empty = styled(({ className, description }: { description: string } & BareProps) => {
  return (
    <Card className={className}>
      <UIEmpty description={description} />
    </Card>
  );
})`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 640px;
  font-size: 16px;
  color: var(--text-color-second);
  font-weight: 500;
`;
