import { useCallback, useEffect, useReducer, useRef } from 'react';
import { Extrinsic, QueryData, SubscanDataProvider, TransitionsHistoryDataProvider } from '@acala-dapp/react-hooks/transactions-history/data-provider';
import { useMemorized } from '@acala-dapp/react-hooks';

interface TransitionsHistoryState {
  queryParams?: { data: QueryData[]; limit?: number };
  list: Extrinsic[];
}

const initState: TransitionsHistoryState = {
  list: []
};

type TransitionAction = {
  type: 'set_query_params';
  value: { data: QueryData[]; limit?: number };
} | {
  type: 'set_list';
  value: Extrinsic[];
}

const reducer = (state: TransitionsHistoryState, action: TransitionAction): TransitionsHistoryState => {
  switch (action.type) {
    case 'set_query_params': {
      return {
        ...state,
        queryParams: action.value
      };
    }

    case 'set_list': {
      return {
        ...state,
        list: action.value
      };
    }
  }
};

interface HooksReturnType {
  data: TransitionsHistoryState;
  setQueryParams: (params: QueryData[]) => void;
  refresh: (() => void) | undefined;
}

export const useTransitionsHistoryStore = (): HooksReturnType => {
  const [data, dispatch] = useReducer(reducer, initState);
  const _queryParams = useMemorized(data.queryParams);
  const dataProviderRef = useRef<TransitionsHistoryDataProvider>();
  const refreshRef = useRef<() => void>();
  const setQueryParams = useCallback((params: QueryData[]) => {
    dispatch({
      type: 'set_query_params',
      value: { data: params, limit: 10 }
    });
  }, []);
  const result = useMemorized({
    data,
    refresh: refreshRef.current,
    setQueryParams
  });

  useEffect(() => {
    if (!_queryParams?.data) return;

    if (!dataProviderRef.current) {
      dataProviderRef.current = new SubscanDataProvider();
    }

    refreshRef.current = dataProviderRef.current.refresh.bind(dataProviderRef.current);

    const subscriber = dataProviderRef.current.subscrite(
      _queryParams.data,
      _queryParams?.limit || 20
    ).subscribe({
      next: (data) => {
        dispatch({ type: 'set_list', value: data });
      }
    });

    return (): void => {
      subscriber.unsubscribe();
      dataProviderRef.current = undefined;
      refreshRef.current = undefined;
    };
  }, [_queryParams]);

  return result;
};
