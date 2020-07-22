import TrackerBase from '@/base';

import Mime from '@/mime';

import Config from '@/config';

import { getUniqueId, getQuery, formatData } from '@/util';

type FreeType = {
  [key: string]: any;
};

type XMLHttpRequestType = typeof XMLHttpRequest;

type XMLReqType = XMLHttpRequest & {
  _requestID?: string;
  _method?: string;
  _url?: string;
  query?: FreeType | string;
  body?: FreeType | string;
};

type RequestMap = {
  [key: string]: XMLReqType;
};

interface ProxyXHRInterface {
  apply(): void;
};

export default class ProxyXHR extends TrackerBase implements ProxyXHRInterface {

  private requestMap: RequestMap = {};

  constructor() {
    super();
  }

  public apply() {
    const xhr: null | XMLHttpRequestType = window.XMLHttpRequest;
    const _class: ProxyXHR = this;

    if (xhr !== null) {
      const open: Function = window.XMLHttpRequest.prototype.open;
      const send: Function = window.XMLHttpRequest.prototype.send;

      window.XMLHttpRequest.prototype.open = function() {
        const XMLReq: XMLReqType = this;
        const args = [].slice.call(arguments);

        const method: string = (args[0] as string).toUpperCase();
        const url: string = args[1];
        const id: string = getUniqueId();

        let timer: any = null;
        let startTime: number = 0;

        XMLReq._requestID = id;
        XMLReq._method = method;
        XMLReq._url = url;

        _class.requestMap[id] = XMLReq;
  
        // onreadystatechange拦截
        const _onreadystatechange = XMLReq.onreadystatechange || function() {};
        let onreadystatechange = function() {
  
          if (XMLReq.readyState == 0) {
            // XMLHttpRequest 代理已被创建, 但尚未调用open()方法
            startTime = +(new Date);
          } else if (XMLReq.readyState == 1) {
            // open()方法已经被触发
            startTime = +(new Date);
          } else if (XMLReq.readyState == 2) {
            // send()方法已经被调用,响应头也已经被接收
          } else if (XMLReq.readyState == 3) {
            // 响应体部分正在被接收
          } else if (XMLReq.readyState == 4) {
            // 请求操作已经完成
            clearInterval(timer);

            const current: XMLReqType | null = _class.getRequest(id);
            const needReport: boolean = !(Config.isInExcuteOrigins(url));

            if (current !== null && needReport) {
              const header: string = current.getAllResponseHeaders() || '';
              const headerArr: Array<string> = header.split('\n');
  
              const headers: FreeType = {};
  
              for (let i = 0; i < headerArr.length; i ++) {
                let line = headerArr[i];
  
                if (!line) { continue; }
  
                const arr = line.split(': ');
                const key = arr[0];
                const value = arr.slice(1).join(': ');
                headers[key] = value;
              }

              _class.report('request', {
                url,
                method,
                query: current.query,
                body: current.body,
                costTime: `${+(new Date) - startTime}ms`,
                status: current.status,
                response: current.response || current.responseText || current.responseXML,
                responseType: Mime.getMime(current.getResponseHeader('content-type') as string)
              });

              delete _class.requestMap[id];
            }
          } else {
            clearInterval(timer);
          }
  
          return _onreadystatechange.apply(XMLReq, arguments as any);
        };

        XMLReq.onreadystatechange = onreadystatechange;

        // some 3rd libraries will change XHR's default function
        // so we use a timer to avoid lost tracking of readyState
        let preState = -1;
        timer = setInterval(() => {
          if (preState !== XMLReq.readyState) {
            preState = XMLReq.readyState;
            onreadystatechange.call(XMLReq);
          }
        }, 10);
  
        return open.apply(XMLReq, args);
      };

      window.XMLHttpRequest.prototype.send = function() {
        const XMLReq: XMLReqType = this;
        const args = [].slice.call(arguments);

        XMLReq.body = formatData(args[0]);
        XMLReq.query = getQuery(XMLReq._url ?? '');

        return send.apply(XMLReq, args);
      };
    }
  }

  private updateReqMap(id: string, req: XMLReqType): void {
    const current: XMLReqType = this.requestMap[id];

    this.requestMap[id] = {
      ...current,
      query: req.query,
      body: req.body
    };
  }

  private getRequest(id: string): XMLReqType | null {
    return this.requestMap[id];
  }

}