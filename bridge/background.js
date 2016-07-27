/**
 * Created by zyg on 16/3/31.
 */
var portArrCache = [];

var openVariablesWatch = false;

var VW = 'VW'

chrome.runtime.onConnect.addListener(function (port) {
  portArrCache.push(port);

  function broadCast(m){
    portArrCache.filter(function (p) {
      return p !== port
    }).forEach(function (p) {
      p.postMessage(m);
    });
  }

  port.onMessage.addListener(function (m) {

    console.log('m',m);

    switch (m.type){

      //开关变量监控
      case VW:
        openVariablesWatch = !openVariablesWatch;
        broadCast(m);
        break;
      default:
        broadCast({
          ga:m
        });
    }
  });

  port.onDisconnect.addListener(function () {
    portArrCache = portArrCache.filter(function (portCache) {
      return portCache !== port;
    })
  });
});

var urlBeforeHandlers = [
  {
    test: function (details) {
      var url = details.url;
      return /\.js/.test(url) && !/chrome-extension/.test(url) && openVariablesWatch
    },
    handler: function (details) {

      console.log(details)

      return {
        redirectUrl: 'javascript:'
      }
    }
  }
];

var urlCompletedHandlers = [{
  test: function (details) {
    return /\/use\.jpg/.test(details.url)
  },
  handler: function (details) {

    var url = details.url;

    var urlObj = new URL(url);
    var searchObj = urlObj.search.substr(1).split('&').map(function (kv) {
      return kv.split('=').map(function (str) {
        return decodeURIComponent(str);
      });
    }).reduce(function (pre, kvArr) {
      var kvObj = {};
      kvObj[kvArr[0]] = kvArr[1];
      return Object.assign(pre, kvObj);
    }, {});

    console.log('ajax:', searchObj.tag);

    portArrCache.forEach(function (p) {
      p.postMessage({
        req: {
          ga: searchObj.tag,
        }
      });
    });
  }
}, {
  test: function (details) {
    var code = details.statusCode;
    return code >= 500
  },
  handler: function (details) {
    var url = details.url;
    var code = details.statusCode;

    portArrCache.forEach(function (p) {
      p.postMessage({
        code500: {
          url: url,
          code: code,
        }
      });
    });
  }
}]


chrome.webRequest.onBeforeRequest.addListener(function (details) {
  var r =  urlBeforeHandlers.reduce(function (v, obj) {
    if (obj.test(details)) {
      v = obj.handler(details)
    }
    return v;
  }, undefined)
  return r;

}, {urls: ["<all_urls>"]},['blocking']);

chrome.webRequest.onCompleted.addListener(function (details) {
  urlCompletedHandlers.forEach(function (obj) {
    if (obj.test(details)) {
      obj.handler(details)
    }
  })

}, {urls: ["<all_urls>"]});