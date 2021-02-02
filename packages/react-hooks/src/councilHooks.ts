import { useMemo, useState, useEffect } from 'react';
import { combineLatest, Observable, of } from 'rxjs';
import { startWith, switchMap, map, filter, tap } from 'rxjs/operators';

import { ApiRx } from '@polkadot/api';
import { Vec, Option } from '@polkadot/types';
import { Proposal, Hash, Votes, EventRecord, Scheduled } from '@polkadot/types/interfaces';
import { AccountId } from '@acala-network/types/interfaces/types';

import { useApi } from './useApi';
import { useQuery, useQueryMulti } from './useQuery';
import { useSubscription } from './useSubscription';
import { useMemorized } from './useMemorized';

export interface ProposalData {
  proposal: Proposal;
  vote: Votes;
  hash: string;
  council: string;
}

function getAllCouncil (api: ApiRx): string[] {
  return Object.keys(api.query)
    .filter((key: string): boolean => {
      return key.endsWith('Council') || key === 'technicalCommittee';
    });
}

function fetchProposalAndVote (api: ApiRx, council: string, hash: string): Observable<ProposalData> {
  return combineLatest(
    api.query[council].proposalOf<Option<Proposal>>(hash),
    api.query[council].voting<Option<Votes>>(hash)
  ).pipe(
    map(([proposal, vote]) => {
      return {
        council,
        hash: hash,
        proposal: proposal.unwrapOrDefault(),
        vote: vote.unwrapOrDefault()
      };
    })
  );
}

function fetchAllProposalAndVote (api: ApiRx, council: string): Observable<ProposalData[]> {
  return api.query[council].proposals<Vec<Hash>>().pipe(
    switchMap((result) => {
      if (result.isEmpty) return of([]);

      return combineLatest(
        result.map((hash) => fetchProposalAndVote(api, council, hash.toString()))
      );
    })
  );
}

export const useCouncilList = (): string[] => {
  const { api } = useApi();

  return useMemo(() => {
    if (!api) return [];

    return getAllCouncil(api);
  }, [api]);
};

export const useAllCouncilMembers = (): { loading: boolean; init: boolean; members: { council: string; data: AccountId[]}[] } => {
  const { api } = useApi();
  const councils = useMemo(() => getAllCouncil(api), [api]);

  const { data: members, status: { init, loading } } = useQueryMulti<AccountId[][]>(councils.map((item) => {
    return {
      params: [],
      path: `query.${item}.members`
    };
  }));

  return useMemo(() => {
    return {
      init,
      loading,
      members: councils.map((item, index) => ({
        council: item,
        data: members ? members[index] : []
      }))
    };
  }, [members, loading, init, councils]);
};

export const useCouncilMembers = (council: string): Vec<AccountId> | undefined => {
  const { data: members } = useQuery<Vec<AccountId>>(`query.${council}.members`, []);

  return members;
};

export const useProposal = (council: string, hash: string): ProposalData | null => {
  const _council = council.endsWith('Council') ? council : council + 'Council';
  const { api } = useApi();
  const [data, setData] = useState<ProposalData | null>(null);

  useEffect(() => {
    if (!api || !api.query[_council]) return;

    const subscriber = fetchProposalAndVote(api, _council, hash)
      .subscribe((data) => setData(data));

    return (): void => subscriber.unsubscribe();
  }, [api, _council, hash]);

  return data;
};

export const useProposals = (council: string): { data: ProposalData[]; loading: boolean } => {
  const _council = council.endsWith('Council') ? council : council + 'Council';
  const { api } = useApi();
  const [data, setData] = useState<ProposalData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!api || !api.query[_council]) return;

    setLoading(true);
    const subscriber = fetchAllProposalAndVote(api, _council)
      .subscribe((data) => {
        setData(data);
        setLoading(false);
      });

    return (): void => subscriber.unsubscribe();
  }, [api, _council]);

  return useMemo(() => ({ data, loading }), [data, loading]);
};

export const useRecentProposals = (): { data: ProposalData[]; loading: boolean } => {
  const { api } = useApi();
  const [data, setData] = useState<ProposalData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!api) return;

    const councils = getAllCouncil(api);

    setLoading(true);
    const subscriber = combineLatest(
      councils.map((item) => fetchAllProposalAndVote(api, item))
    ).subscribe((result) => {
      const _data = result
        .reduce((acc, cur): ProposalData[] => [...acc, ...cur], [])
        .sort((a, b) => a.vote.end.toNumber() - b.vote.end.toNumber())
        .slice(0, 4);

      setData(_data);
      setLoading(false);
    });

    return (): void => subscriber.unsubscribe();
  }, [api, setLoading, setData]);

  return useMemo(() => ({ data, loading }), [data, loading]);
};

export interface SchedulerData {
  blockAt: number;
  scheduler: Scheduled;
}

export const useScheduler = (): { data: SchedulerData[]; loading: boolean } => {
  const { api } = useApi();
  const [data, setData] = useState<SchedulerData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const _data = useMemorized({ data, loading });

  useSubscription(() => {
    return api.query.system.events().pipe(
      // trigger immediately
      startWith([{ event: { section: 'scheduler' } }] as unknown as Vec<EventRecord>),
      // if receive events from scheduler, reflash data
      filter((events) => {
        return events.findIndex((event: EventRecord) => event?.event?.section === 'scheduler') !== -1;
      }),
      tap(() => setLoading(true)),
      switchMap(() => {
        return api.query.scheduler.agenda.entries();
      }),
      tap(() => setLoading(false))
    ).subscribe({
      next: (result) => {
        const data = result.reduce((acc, cur) => {
          return acc.concat(
            cur[1].map((item) => {
              return {
                blockAt: (cur[0] as any)?._args[0]?.toNumber() | 0,
                scheduler: item.unwrapOrDefault()
              };
            })
          );
        }, [] as SchedulerData[]);

        setData(data);
      }
    });
  }, [api, setData]);

  return _data;
};
