import axios from 'axios';
import { Subject, timer, combineLatest, from, Observable } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';

export interface Event {
  name: string;
  data: any[];
}

export interface Extrinsic {
  block: number;
  timestamp: number;
  extrinsicHash: string;
  section: string;
  method: string;
  params: any[];
  events: Event[];
}

export interface QueryData {
  account?: string;
  section: string;
  method: string;
}

export abstract class TransitionsHistoryDataProvider {
  abstract refresh (): void;
  abstract subscrite (data: QueryData[], limit?: number): Observable<Extrinsic[]>;
}

class BaseTransitionsHistoryDataProvider {
  protected $refresh: Subject<number>;
  protected $data: Subject<Extrinsic[]>;
  private count: number;

  constructor () {
    this.count = 0;
    this.$refresh = new Subject<number>();
    this.$data = new Subject<Extrinsic[]>();
  }

  public refresh (): void {
    this.$refresh.next(this.count);

    this.count = this.count + 1;
  }

  public autoRefresh (time = 1000 * 30): void {
    timer(0, time || 1000 * 30)
      .subscribe(() => {
        this.refresh();
      });
  }
}

const SUBSCAN_QUERY_EXTRINSICS_API = 'https://acala-testnet.subscan.io/api/scan/extrinsics';
const SUBSCAN_QUERY_EXTRINSIC_API = 'https://acala-testnet.subscan.io/api/scan/extrinsic';

export class SubscanDataProvider extends BaseTransitionsHistoryDataProvider
  implements TransitionsHistoryDataProvider {
  public subscrite (
    data: QueryData[],
    limit?: number
  ): Observable<Extrinsic[]> {
    this.autoRefresh();

    return this.$refresh.pipe(
      tap((count) => {
        console.log(count);
      }),
      switchMap(() => {
        return combineLatest(
          data.map(({ account, method, section }) => from(this.queryExtrinsics(section, method, limit, account)))
        ).pipe(
          map((list) => {
            return list
              .reduce((acc, cur) => acc.concat(cur), [])
              .sort((a, b) => a.timestamp - b.timestamp)
              .slice(0, 20);
          })
        );
      })
    );
  }

  public async queryExtrinsics (
    section: string,
    method: string,
    limit = 20,
    account?: string
  ): Promise<Extrinsic[]> {
    const data = await axios.post(SUBSCAN_QUERY_EXTRINSICS_API, {
      address: account,
      call: method,
      module: section,
      page: 1,
      row: limit
    });

    let list = [];

    if (data.status === 200 && data.data.code === 0) {
      list = data?.data?.data?.extrinsics || [];
    }

    const getParams = (params: string): any[] => {
      try {
        return JSON.parse(params);
      } catch (e) {
        // ignore error
      }

      return [params];
    };

    return list.map((item: any) => ({
      block: item.block_num,
      extrinsicHash: item.extrinsic_hash,
      method: item.call_module_function,
      params: getParams(item.params),
      section: item.call_module,
      timestamp: item.block_timestamp
    })) as Extrinsic[];
  }

  public async queryExtrinsicDetail (
    hash: string
  ): Promise<{}> {
    const data = await axios.post(SUBSCAN_QUERY_EXTRINSIC_API, { hash });

    if (data.status === 200 && data.data.code === 0) {
      return data.data.data;
    }

    return {};
  }
}
