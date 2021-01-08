import { useEffect, useMemo } from 'react';
import { get as _get, isEmpty } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { ApiRx } from '@polkadot/api';

import { useStore } from '@acala-dapp/react-environment';

import { useIsAppReady } from './useIsAppReady';
import { useApi } from './useApi';
import { CallParams } from './types';

class Tracker {
  private trackerList: Record<string, { refCount: number; subscriber: Subscription }>;

  constructor () {
    this.trackerList = {};
  }

  subscribe (
    api: ApiRx,
    path: string,
    params: CallParams,
    key: string,
    callback: (key: string, valeu: any) => void
  ): void {
    if (isEmpty(api)) return;

    if (!path || path === '__phantomdata') return;

    // update tracker list
    if (this.trackerList[key]) {
      this.trackerList[key].refCount += 1;

      return;
    }

    const fn = _get(api, path);

    if (!fn) throw new Error(`can't find method:${path} in api`);

    callback(key, { data: undefined, status: { loading: true } });
    const subscriber = (fn.apply(fn, key.startsWith('multi') ? [params] : params) as Observable<unknown>).subscribe({
      error: () => {
        console.error(`Error in fetch ${key} data`);
      },
      next: (result: any) => {
        callback(key, { data: result, status: { loading: false } });
      }
    });

    // update tracker list
    this.trackerList[key] = {
      refCount: 1,
      subscriber
    };
  }

  unsubscribe (key: string): void {
    if (this.trackerList[key]) {
      this.trackerList[key].refCount -= 1;
    }
  }
}

const tracker = new Tracker();

type UseCallResult<T> = {
  data: T;
  status: {
    loading: boolean;
    init: boolean;
  };
}

export function useQuery<T> (path: string, params: CallParams = [], options?: {
  cacheKey: string;
}): UseCallResult<T | undefined> {
  const { api } = useApi();
  const isAppReady = useIsAppReady();
  const { get, set } = useStore('apiQuery');
  const key = useMemo(() => `${path}-${JSON.stringify(params) || 'empty'}-${options?.cacheKey || 'no_cached'}`, [path, params, options]);

  // on changes, re-subscribe
  useEffect(() => {
    // check if we have a function & that we are mounted
    if (!isAppReady) return;

    // if path is __phantomdata, pass
    if (path === '__phantomdata') return;

    tracker.subscribe(api, path, params, key, set);

    return (): void => tracker.unsubscribe(key);
  }, [isAppReady, api, path, params, key, set]);

  return useMemo(() => {
    const data = get(key);

    if (!data) {
      return {
        data: undefined,
        status: {
          init: false,
          loading: false
        }
      };
    }

    return {
      data: data.data,
      status: {
        init: true,
        loading: data?.status?.loading || false
      }
    };
  }, [key, get]);
}

export function useQueryMulti<T> (calls: { path: string; params: CallParams }[], options?: {
  cacheKey: string;
}): UseCallResult<T | undefined> {
  const { api } = useApi();
  const isAppReady = useIsAppReady();
  const { get, set } = useStore('apiQuery');
  const key = useMemo(() => `multi-${JSON.stringify(calls)}-${options?.cacheKey || 'no_cached'}`, [calls, options]);

  // on changes, re-subscribe
  useEffect(() => {
    // check if we have a function & that we are mounted
    if (!isAppReady) return;

    if (!calls || calls.length === 0) return;

    tracker.subscribe(
      api,
      'queryMulti',
      calls.map((config) => [_get(api, config.path), ...config.params]),
      key,
      set
    );

    return (): void => tracker.unsubscribe(key);
  }, [isAppReady, api, calls, key, set]);

  return useMemo(() => {
    const data = get(key);

    if (!data) {
      return {
        data: undefined,
        status: {
          init: false,
          loading: false
        }
      };
    }

    return {
      data: data.data,
      status: {
        init: true,
        loading: data?.status?.loading || false
      }
    };
  }, [key, get]);
}
