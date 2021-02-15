import { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import { useHistory } from './useExtrinsicHistory';
export const HISTORY_VIEW = ['wallet', 'loan', 'homa', 'swap', 'earn'] as const;

export const useAccountHistory = (signer: string, view: typeof HISTORY_VIEW[number]) => {
  const params = useMemo(() => {
    let section = '',
      method = '';

    if (view === 'swap') {
      section = 'dex';
    }

    if (view === 'wallet') {
      section = 'currencies';
      method = 'transfer';
    }

    if (view === 'earn') {
      section = 'incentives';
    }

    if (view === 'homa') {
      section = 'homa';
    }

    if (view === 'loan') {
      section = 'loan';
    }

    return {
      signer,
      section,
      method
    };
  }, [signer, view]);

  return useHistory(params);
};
