import TrackerBase from '@/base';

import { wrapFn } from '@/util';

type FreeType = {
  [key: string]: any;
};

const ERROR_EVENTS: Array<string> = [
	'onerror',
	'onunhandledrejection'
];

const EVENT_TARGET: Array<string> = [
  'EventTarget',
  'Window',
  'Node',
  'ApplicationCache',
  'AudioTrackList',
  'ChannelMergerNode',
  'CryptoOperation',
  'EventSource',
  'FileReader',
  'HTMLUnknownElement',
  'IDBDatabase',
  'IDBRequest',
  'IDBTransaction',
  'KeyOperation',
  'MediaController',
  'MessagePort',
  'ModalWindow',
  'Notification',
  'SVGElementInstance',
  'Screen',
  'TextTrack',
  'TextTrackCue',
  'TextTrackList',
  'WebSocket',
  'WebSocketWorker',
  'Worker'
];

export default class TrackerError extends TrackerBase {

	private catchTimeout() {
		const timeoutFn: Function = window.setTimeout;

		return function(context: any, ...args: any[]) {
			const originalCallback: Function = args[0];
			
		};
	}

	private catchInterval() {}

	private catchError() {
		const win: Window = window;
		const _class: TrackerError = this;

		ERROR_EVENTS.forEach((name: string) => {
			const oldHandler: Function | null = win[name];

			win[name] = function(e: Error) {
				_class.report(name, {
          reason: e.message
				});

				if (typeof oldHandler === 'function') {
					oldHandler.apply(win, arguments);
				}
			};
		});
	}

	private catchEventListener() {
    const win: FreeType = window;
    EVENT_TARGET.forEach((event: string) => {
      const eventItem = win[event];
      const protoType = eventItem && eventItem.prototype;

      if (eventItem && protoType && protoType.hasOwnProperty && protoType.hasOwnProperty('addEventListener')) {
        const oldAddListener = protoType.addEventListener;
        const oldRemoveListener = protoType.removeEventListener;

        console.log(protoType);
        protoType.addEventListener = function(eventName: string, callback: EventListenerObject, options?: boolean | EventListenerOptions) {
          oldAddListener.call(this, eventName, wrapFn(callback as any, (error: any, event: Event) => {
          }) as any, options);
        };

        protoType.removeEventListener = function(eventName: string, callback: EventListenerObject, options?: boolean | EventListenerOptions) {
          oldRemoveListener.call(this, eventName, wrapFn(callback as any, (error: DOMError, event: Event) => {
          }) as any, options);
        };
      }
    });
  }
  
  apply() {
    this.catchTimeout();
    this.catchInterval();
    this.catchError();
    this.catchEventListener();
  }

}
