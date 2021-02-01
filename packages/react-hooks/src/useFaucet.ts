import { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import { useAccounts } from './useAccounts';
import { message } from '@acala-dapp/ui-components';

const FUACET_API = 'https://api.polkawallet.io/v2/faucet-tc6/faucet';

export const useFaucet = (strategy = 'ren'): { loading: boolean; run: () => void } => {
  const { active } = useAccounts();
  const [loading, setLoading] = useState<boolean>(false);
  const run = useCallback(() => {
    if (!active) return;

    setLoading(true);

    axios.post(
      FUACET_API,
      {
        account: active?.address,
        address: active?.address,
        strategy
      }
    ).then((response) => {
      if (response?.data?.code === 200) {
        message.info('success');
      } else {
        message.error(response?.data?.message);
      }
    }).catch(() => {
      message.error('request faucet failed');
    }).finally(() => {
      setLoading(false);
    });
  }, [active, strategy]);

  const data = useMemo(() => ({
    loading,
    run
  }), [run, loading]);

  return data;
};
