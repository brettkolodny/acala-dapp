import { useState, useEffect, useRef } from 'react';
import { noop } from 'lodash';

import { useMemorized } from '../useMemorized';
import { QueryData, Extrinsic, TransitionsHistoryDataProvider, SubscanDataProvider } from './data-provider';

interface UseTransitionHistoryParams {
  dataProvider: 'subscan';
  queryData: QueryData[];
  limit: number;
}

export const useTransitionsHistory = ({ dataProvider , queryData }: UseTransitionHistoryParams) => {
  const _queryData = useMemorized(queryData);
  const list = useState<Extrinsic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<() => void>(noop);
  const data = useMemorized({ list, loading, refresh });
  const dataProviderRef = useRef<TransitionsHistoryDataProvider>();

  useEffect(() => {
    if (dataProviderRef.current) return;

    if (dataProvider === 'subscan') {
      dataProviderRef.current = new SubscanDataProvider();
    }

    if (!dataProviderRef.current) return;

    console.log('hello');

    dataProviderRef.current.subscrite(_queryData).subscribe({
      next: (data) => {
        console.log(data);
      }
    });
  }, [_queryData, dataProvider]);

  return data;
};

