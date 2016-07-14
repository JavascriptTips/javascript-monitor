var body = document.querySelector('body');
var gaBox = createBox();
body.appendChild(gaBox.box);

function createBox(){
  var div = document.createElement('div');
  div.id = 'gaBox';

  var logDiv = document.createElement('p');
  logDiv.className = 'logs';

  var reqLogDiv = document.createElement('p');
  reqLogDiv.className = 'req-logs';

  div.appendChild(logDiv);
  div.appendChild(reqLogDiv);

  return {
    box:div,
    logsBox:logDiv,
    reqLogsBox:reqLogDiv,
    createLog: function (arr,preText) {
      if(typeof arr === 'string'){
        arr = arr.replace(/\|/g,'%->%').split('%')
      }

      var p = document.createElement('p');

      var pre = document.createElement('span');
      pre.innerText = preText;

      p.appendChild(pre);
      arr.forEach(function (log) {
        var span = document.createElement('span');
        span.innerText = log;
        p.appendChild(span);
      });
      return p;
    }
  };
}

function listenGa(callback){
  var body = document.querySelector('body');

  body.addEventListener('mouseover', onMouseOver);

  function onMouseOver(e){
    var ga = e.target.getAttribute('data-ga');
    if(!ga){
      return;
    }
    callback(ga);
  }

  return function () {
    body.removeEventListener('mouseover',onMouseOver);
  }
}

function updateShowLogs(logsContainer,newLogs){
  if(logsContainer.children.length > 0){
    logsContainer.replaceChild(newLogs,logsContainer.children[0]);
  }else{
    logsContainer.appendChild(newLogs);
  }
  return newLogs;
}

function updateReqLogs(reqLogs){
  updateShowLogs(gaBox.reqLogsBox,gaBox.createLog(reqLogs,'请求:'));
}

window.removeGaListen = listenGa(function (logs) {
  updateShowLogs(gaBox.logsBox,gaBox.createLog(logs,'埋点:'));
});