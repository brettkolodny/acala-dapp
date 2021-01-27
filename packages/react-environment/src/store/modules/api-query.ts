import { useMemorized } from '@acala-dapp/react-hooks/';
import { useCallback, useMemo, useReducer } from 'react';

type ApiQueryData = {
  data: any;
  status?: {
    loading: boolean;
  };
}

type ApiQueryState = Record<string, ApiQueryData>;

type ApiQueryAction = {
  type: 'receive_result';
  data: {
    key: string;
    value: {
      data: any;
      status?: {
        loading: boolean;
      };
    };
  };
}

const reducer = (state: ApiQueryState, action: ApiQueryAction): ApiQueryState => {
  switch (action.type) {
    case 'receive_result': {
      return {
        ...state,
        [action.data.key]: action.data.value
      };
    }

    default: {
      return state;
    }
  }
};

type UseApiQueryStoreResult = {
  get: (key: string) => ApiQueryData;
  set: (key: string, data: ApiQueryData) => void;
}

const initState: ApiQueryState = {};

export const useApiQueryStore = (): UseApiQueryStoreResult => {
  const [state, dispatch] = useReducer(reducer, initState);

  const set = useCallback((key: string, value: ApiQueryData) => {
    dispatch({
      data: { key, value },
      type: 'receive_result'
    });
  }, [dispatch]);

  const get = useCallback((key: string): ApiQueryData => {
    return state[key];
  }, [state]);

  return useMemo(() => ({ get, set }), [set, get]);
};
