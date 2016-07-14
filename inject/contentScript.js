function loadJs(jsPath){
  var s = document.createElement('script');
  s.type = 'text/javascript';

  s.src = chrome.extension.getURL(jsPath);
  (document.head || document.documentElement).appendChild(s);
}
loadJs('inject/notify.js')
loadJs('inject/monitorError.js')

var notify = createNotify('网络500')

document.addEventListener('DOMContentLoaded', function () {

  var body = document.body;

  var port = chrome.runtime.connect();
  port.onDisconnect.addListener(function () {
    console.log('断开了');
  });
  port.onMessage.addListener(function (m) {
    if(m.code500){
      notify(m.code500.url, m.code500.code)
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