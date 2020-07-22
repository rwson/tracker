const mimes = {
  'text/html': 'html',
  'text/plain': 'text',
  'text/xml': 'xml',
  'application/xml': 'xml',
  'application/json': 'json',
  'application/pdf': 'pdf',
  'application/msword': 'word',
  'application/octet-stream': 'stream',
  'application/x-www-form-urlencoded': 'form'
};

export default class Mime {

  static getMime(response: string): string {
    if (response === null) {
      return '';
    }

    const keys: Array<string> = Object.keys(mimes);

    for (let i = 0, { length } = keys; i < length; i ++) {
      if (response.indexOf(keys[i]) > -1) {
        return mimes[keys[i]];
      }
    }

    return '';
  }

}