type ExcuteOrigins = Array<string|RegExp>;

type configParams = {
  excuteOrigins: ExcuteOrigins
};

interface ConfigInterface {

  config: (config: configParams)=> void;

  isInExcuteOrigins: (url: string)=> boolean;

}

class Config implements ConfigInterface {

  private excuteOrigins: ExcuteOrigins = [
    'http://localhost'
  ];

  public config(config: configParams): void {
    for (const key of Object.keys(config)) {
      this[key] = config[key];
    }
  }

  public isInExcuteOrigins(url: string): boolean {
    for (let i = 0, { length } = this.excuteOrigins; i < length; i ++) {
      const origin: string|RegExp = this.excuteOrigins[i];

      if (Object.prototype.toString.call(origin) === '[object RegExp]') {
        if ((origin as RegExp).test(url)) {
          return true;
        }
      } else {
        if (url.indexOf(origin as string) > -1) {
          return true;
        }
      }
    }

    return false;
  }

}

export default new Config;