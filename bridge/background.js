/**
 * Created by zyg on 16/3/31.
 */
var portArrCache = [];

chrome.runtime.onConnect.addListener(function (port) {
  portArrCache.push(port);

  port.onMessage.addListener(function (m) {
    console.log('onMessage:',m);
    portArrCache.forEach(function (p) {
      p.postMessage({
        m:m
      });
    });
  });

  port.onDisconnect.addListener(function() {
    portArrCache = portArrCache.filter(function (portCache) {
      return portCache !== port;
    })
  });
});


chrome.webRequest.onCompleted.addListener(function (details) {
  var url = details.url;



  if(/\/use\.jpg/.test(url)){

    var urlObj = new URL(url);
    var searchObj = urlObj.search.substr(1).split('&').map(function (kv) {
      return kv.split('=').map(function (str) {
        return decodeURIComponent(str);
      });
    }).reduce(function (pre,kvArr) {
      var kvObj= {};
      kvObj[kvArr[0]] = kvArr[1];
      return Object.assign(pre,kvObj);
    },{});

    console.log('ajax:',searchObj.tag);

    portArrCache.forEach(function (p) {
      p.postMessage({
        req:{
          ga:searchObj.tag,
        }
      });
    });
  }
},{urls: ["<all_urls>"]});