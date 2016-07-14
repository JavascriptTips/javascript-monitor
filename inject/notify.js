/**
 * Created by zyg on 16/7/14.
 */
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
function clear(notification){
  notifyArr.push(notification);
  if(notifyArr.length > 3 ){
    notifyArr.shift().close();
  }
}


function createNotify(title){
  return function(pre,msg){
    var notification = new Notification(title,{
      body:pre+':'+msg,
      //icon:'../images/red.png'
    });

    clear(notification)
  }
}
var notifyArr = [];
