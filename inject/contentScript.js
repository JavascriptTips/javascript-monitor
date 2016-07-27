/**
 * Created by zyg on 16/7/14.
 */
var notify = require('./common/notify')
var loadJs = require('./common/loadJs')

loadJs('/dist/window.bundle.js')

//连接信息，监听dom
document.addEventListener('DOMContentLoaded', function () {

  var myNotify = notify.createNotify('网络500')

  var body = document.body;

  var port = chrome.runtime.connect();
  port.onDisconnect.addListener(function () {
    console.log('断开了');
  });
  port.onMessage.addListener(function (m) {

    console.log(m);
    switch (m.type){
      case 'VW':
        location.reload();
        break;
    }

    if(m.code500){
      notify.createNotificationObj(function(){
        myNotify(m.code500.url, m.code500.code)
      })
    }
  })

  function sendMessage(gaStr) {
    port.postMessage(gaStr);
  }

  sendMessage('init');

  body.addEventListener('mouseover', onMouseOver);
  function onMouseOver(e) {
    var ga = e.target.getAttribute('data-ga');
    if (!ga) {
      return;
    }
    console.log(ga);

    sendMessage({
      title:document.title,
      ga:ga
    });
  }
});



//代理
var _XMLHttpRequest = window.XMLHttpRequest;
window.XMLHttpRequest = function(){
  var req = new _XMLHttpRequest();

  var _open = req.open;
  var _send = req.send;

  req.open = function(type, url, async){
    console.log('req:',url);
    _open.apply(req, arguments)
  };
  req.send = function (data) {
    console.log('req:',data);
    _send.apply(req,arguments)
  };

  return req;
};