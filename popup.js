var msgType = require('./inject/common/msgType')

//
//document.querySelector('.new-window').onclick = function () {
//  chrome.windows.create({
//    top: 110,
//    left: 0,
//    width: 230,
//    height: 300,
//    type: 'popup',
//    url: 'popup/logWindow/newWindow.html'
//  }, function (win) {
//    console.log(win)
//  });
//};

document.querySelector('.variables-monitor').onclick = function () {

  var port = chrome.runtime.connect();

  port.postMessage({
    type:msgType.VW
  })
};