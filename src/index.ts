import {
  TrackerConsole,
  TrackerError,
  ProxyFetch,
  Load,
  ProxyXHR
} from '@/integrations';

class Tracker {

  init() {
    // const proxyXhr: ProxyXHR = new ProxyXHR();
    // const proxyFetch: ProxyFetch = new ProxyFetch();
    const load: Load = new Load();
    const trackerError: TrackerError = new TrackerError();

    // proxyXhr.apply();
    // proxyFetch.apply();
    load.apply();
    trackerError.apply();
  }

}

(new Tracker()).init();

// const xhr = new XMLHttpRequest();

// xhr.open('GET', 'https://cnodejs.org/api/v1/topics?page=1&limit=2');
// xhr.open('POST', 'http://localhost:3000/post');

// xhr.send('string=tset');

// fetch('http://localhost:3000/post', {
//   method: 'post',
//   body: 'string=tset'
// }).then((res) => {
//   console.log(res);
// })

// const listen = window.EventTarget.prototype;
// const listenFn = listen.addEventListener;

// listen.addEventListener = function(eventName: string, fn: EventListenerObject, options?: boolean | AddEventListenerOptions) {
//   try {
//     listenFn.apply(window.EventTarget, arguments as any);
//   } catch (e) {
//     console.log(e);
//   }
// };


// const el: null | HTMLDivElement = document.querySelector('#click');

// if (el !== null) {
//   el.addEventListener('click', function() {
//     console.log(1111);
//     throw new Error('click error');
//   });
// }

// window.onunhandledrejection = (e: PromiseRejectionEvent) => {
//   console.log(e);
//   console.log(223);
// }

// window.addEventListener('unhandledrejection', (e) => {
//   console.log(e);
//   console.log(222);
// });

// Promise.reject('111');

setTimeout(() => {
  console.log(1113333);

  // throw new Error('1111');
}, 100);
