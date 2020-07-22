import * as Bowser from 'bowser';

type ConnectionType = {
  onchange: null | Function;
  effectiveType: string;
  rtt: number;
  downlink: number;
  saveData: boolean;
  [key: string]: any;
};

interface TrackerBaseInterface {
  report:(type: string, body: any) => void
}

class TrackerBase implements TrackerBaseInterface {

  public report(type: string, delta: {[key: string]: any}) {
    const nav = window.navigator as any;
    const connection: ConnectionType = nav.connection || nav.mozConnection || nav.webkitConnection;
    const browserInfo: Bowser.Parser.ParsedResult = Bowser.parse(window.navigator.userAgent);

    // console.log(type, body, Bowser.parse(window.navigator.userAgent));
    // console.log(connection);

    console.log(type, delta)
  }

}

export default TrackerBase;