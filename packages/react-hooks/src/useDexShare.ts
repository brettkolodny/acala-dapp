import { Share } from '@acala-network/types/interfaces';
import { AccountId } from '@polkadot/types/interfaces';

import { useQuery } from './useQuery';
import { useAccounts } from './useAccounts';
import { CurrencyLike } from './types';

interface DexShareData {
  share: Share | undefined;
  totalShares: Share | undefined;
}

export const useDexShare = (token: CurrencyLike, account?: AccountId | string): DexShareData => {
  const { active } = useAccounts();
  const _account = account || (active ? active.address : '');
  const { data: share } = useQuery<Share>('query.dex.shares', [token, _account]);
  const { data: totalShares } = useQuery<Share>('query.dex.totalShares', [token]);

  return { share, totalShares };
};
