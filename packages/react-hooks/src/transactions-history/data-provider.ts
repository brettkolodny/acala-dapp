import axios from 'axios';
import { Subject, interval, combineLatest, from } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { Observable, Subscription } from '@influxdata/influxdb-client';

export interface Event {
  name: string;
  data: any[];
}

export interface Extrinsic {
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
  abstract unsubscrite (): void;
}

class BaseTransitionsHistoryDataProvider {
  $refresh: Subject<number>;
  count: number;

  constructor () {
    this.count = 0;
    this.$refresh = new Subject<number>();
  }

  public refresh (): void {
    this.count = this.count + 1;

    this.$refresh.next(this.count);
  }

  public autoRefresh (time = 1000 * 30): void {
    interval(time || 1000 * 30)
      .pipe(startWith(0))
      .subscribe(() => {
        console.log('interval ??');
        this.refresh();
      });
  }
}

const SUBSCAN_QUERY_EXTRINSICS_API = 'https://acala-testnet.subscan.io/api/scan/extrinsics';

export class SubscanDataProvider extends BaseTransitionsHistoryDataProvider
  implements TransitionsHistoryDataProvider {
  public subscrite (data: QueryData[], limit?: number): Observable<Extrinsic[]> {
    this.autoRefresh();

    return this.$refresh.pipe(
      switchMap(() => {
        console.log('??');

        return combineLatest(
          data.map(({ account, method, section }) => {
            return from(this.queryExtrinsics(section, method, limit, account));
          })
        );
      })
    ) as any as Observable<Extrinsic[]>;
  }

  public async queryExtrinsics (
    section: string,
    method: string,
    limit = 20,
    account?: string
  ): Promise<[]> {
    const data = await axios.post(SUBSCAN_QUERY_EXTRINSICS_API, {
      address: account,
      call: method,
      module: section,
      page: 1,
      row: limit
    });

    console.log(data);

    return [];
  }

  public unsubscrite () {
    this.$refresh.unsubscribe();
  }
}
