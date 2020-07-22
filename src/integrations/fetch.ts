import TrackerBase from '@/base';

import Mime from '@/mime';

import Config from '@/config';

import { getQuery, formatData } from '@/util';

type FreeType = {
  [key: string]: any;
};

type FetchType = typeof window.fetch;

interface ProxyFetchInterface {
  apply(): void;
};

export default class ProxyFetch extends TrackerBase implements ProxyFetchInterface {
  constructor() {
    super();
  }

  public apply():void {
    const fetch: FetchType | null = window.fetch;

    if (fetch !== null) {
      const prevFetch = (url: string, init: RequestInit): Promise<any> => {
        const method: string = (init.method || 'get').toUpperCase();
        const startTime: number = +(new Date());
        const needReport: boolean = !(Config.isInExcuteOrigins(url));

        return fetch(url, init).then((response: Response) => {
          response.clone().json().then((json) => {
            const contentType: string | null = response.headers.get('content-type');
            
            if (needReport) {
              this.report('request', {
                url,
                method,
                query: getQuery(url),
                body: formatData(init.body) || {},
                costTime: `${+(new Date) - startTime}ms`,
                status: response.status,
                response: JSON.stringify(json),
                responseType: Mime.getMime(contentType as string)
              });
            }

            return json;
          });

          return response;
        }, (e) => {
          if (needReport) {
            this.report('request', {
              url,
              method,
              query: getQuery(url),
              body: formatData(init.body) || {},
              costTime: `${+(new Date) - startTime}ms`,
              // status: response.status,
              response: JSON.stringify(''),
              // responseType: Mime.getMime(contentType as string)
            });
          }
        });
      }

      (window.fetch as any) = prevFetch;
    }
  }

}