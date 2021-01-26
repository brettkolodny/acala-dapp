import { useState, useEffect, useRef } from 'react';
import { noop } from 'lodash';

import { useMemorized } from '../useMemorized';
import { QueryData, Extrinsic, TransitionsHistoryDataProvider, SubscanDataProvider } from './data-provider';

interface UseTransitionHistoryParams {
  dataProvider: 'subscan';
  queryData: QueryData[];
  limit: number;
}

export const useTransitionsHistory = ({ dataProvider, queryData }: UseTransitionHistoryParams): {
  list: Extrinsic[];
  loading: boolean;
  refresh: () => void;
} => {
  const _queryData = useMemorized(queryData);
  const [list, setList] = useState<Extrinsic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dataProviderRef = useRef<TransitionsHistoryDataProvider>();
  const refreshRef = useRef<() => void>(noop);
  const data = useMemorized({ list, loading, refresh: refreshRef.current });

  useEffect(() => {
    if (dataProviderRef.current) return;

    if (dataProvider === 'subscan') {
      dataProviderRef.current = new SubscanDataProvider();
    }

    if (!dataProviderRef.current) return;

    refreshRef.current = dataProviderRef.current.refresh.bind(dataProviderRef.current);

    const subscriber = dataProviderRef.current.subscrite(_queryData).subscribe({
      next: (data) => {
        setList(data);
      }
    });

    return (): void => {
      subscriber.unsubscribe();
    };
  }, [_queryData, dataProvider]);

  return data;
};
