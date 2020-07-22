type FreeType = {
  [key: string]: any;
}

type WrappedFunction = {
  _origin?: Function;
  _wrapped?: Function;
} & Function

export const getUniqueId = (): string => {
  let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
    let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
  return id;
};

export const formatData = (str: string | any): FreeType | string | any => {
  if (Object.prototype.toString.call(str) === '[object Object]') {
    return str;
  }

  const res: FreeType = {};

  if (str.indexOf('=') === -1) {
    return str;
  }

  const queryArr: Array<string> = str.split('&');
  for (let q of queryArr) {
    const _q: Array<string> = q.split('=');
    res[_q[0]] = _q[1];
  }

  return res;
};

export const getQuery = (url: string): FreeType | string => {
  const split: Array<string> = url.split('?');
  const res: FreeType = {};

  let query: string = split.length > 1 ? split[1] : '';

  if (!query) {
    return res;
  }

  return formatData(query);
};

export const wrapFn = (
  fn: WrappedFunction
  onError?: Function
): Function => {
    fn._origin = fn;
    if (!fn._wrapped) {
      fn._wrapped = function() {
        try {
          fn.apply(this, arguments);
        } catch (err) {
          if (typeof onError === 'function') {
            onError(err, arguments);
          }
        }
      }
    }
    return fn._wrapped;
}