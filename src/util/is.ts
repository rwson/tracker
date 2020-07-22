const objectPro = Object.prototype;

export const isNode = (): boolean => objectPro.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

export function isInstanceOf(wat: any, base: any): boolean {
  try {
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
}

export const isErrorEvent = (wat: any): boolean => objectPro.toString.call(wat) === '[object ErrorEvent]';

export const isDOMError = (wat: any): boolean => objectPro.toString.call(wat) === '[object DOMError]';

export const isDOMException = (wat: any): boolean => objectPro.toString.call(wat) === '[object DOMException]';

export const isString = (wat: any): boolean => objectPro.toString.call(wat) === '[object String]';

export const isPrimitive = (wat: any): boolean => (wat === null || (typeof wat !== 'object' && typeof wat !== 'function'));

export const isPlainObject = (wat: any): boolean => objectPro.toString.call(wat) === '[object Object]';

export const isEvent = (wat: any): boolean => typeof Event !== 'undefined' && isInstanceOf(wat, Event);

export const isElement = (wat: any): boolean => typeof Element !== 'undefined' && isInstanceOf(wat, Element);

export const isRegExp = (wat: any): boolean => objectPro.toString.call(wat) === '[object RegExp]';

export const isThenable = (wat: any): boolean => Boolean(wat && wat.then && typeof wat.then === 'function');

export const isSyntheticEvent = (wat: any): boolean => isPlainObject(wat) && 'nativeEvent' in wat && 'preventDefault' in wat && 'stopPropagation' in wat;

export const isError = (wat: any): boolean => {
  switch (objectPro.toString.call(wat)) {
    case '[object Error]':
      return true;
    case '[object Exception]':
      return true;
    case '[object DOMException]':
      return true;
    default:
      return isInstanceOf(wat, Error);
  }
}
