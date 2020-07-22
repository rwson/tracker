import TrackerBase from '@/base';

interface LoadInterface {
  apply(): void;
}

export default class Load extends TrackerBase implements LoadInterface {

  public apply(): void {
    window.addEventListener('load', () => {
      const win: any = window;
      let performance = win.performance || win.msPerformance || win.webkitPerformance;
      const timing = performance.timing ?? {};

      if (performance && timing) {
        const times: any = {};

        times.dns = (timing.domainLookupEnd - timing.domainLookupStart);
        times.tcp = (timing.connectEnd - timing.connectStart);
        times.requestFinish = (timing.responseEnd - timing.requestStart);
        times.pageLoaded = (timing.responseEnd - timing.navigationStart);
        times.domLoaded = (timing.domComplete - timing.domLoading);
        times.domParsed = (timing.domInteractive, -timing.domLoading);
        times.sciptLoaded = (timing.domContentLoadedEventEnd, timing.domContentLoadedEventStart);
        times.onloadEvent = (timing.loadEventEnd, timing.loadEventStart);

        this.report('load', times);
      }
    });
  }

}