
function createNotificationObj(cb) {
  var permission = Notification.permission;
  if(permission === 'granted'){
    cb(true);
  }else{
    Notification.requestPermission(function(p){
      if(p === 'granted'){
        cb(true);
      }else{
        cb(false);
      }
    });
  }
}
var notifyArr = [];
function clear(notification){
  notifyArr.push(notification);
  if(notifyArr.length > 3 ){
    notifyArr.shift().close();
  }
}

function notify(file,msg){
  var title = '出错啦';

  var notification = new Notification(title,{
    body:file+':'+msg,
    //icon:'../images/red.png'
  });

  clear(notification)
}

window.addEventListener('error',function (err) {
  var file = err.filename.substr(err.filename.lastIndexOf('/')+1);

  createNotificationObj(function () {
    notify(file,err.message)
  });

  console.error('监控:',err);
});

console.log('监控');