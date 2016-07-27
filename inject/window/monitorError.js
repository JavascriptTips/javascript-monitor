/**
 * Created by zyg on 16/7/14.
 */
//load notify
var notify = require('../common/notify');


var myNotify = notify.createNotify('出错啦')

window.addEventListener('error', function (err) {
  var file = err.filename.substr(err.filename.lastIndexOf('/') + 1);

  notify.createNotificationObj(function () {
    myNotify(file, err.message)
  });

  console.error('监控:', err);
});

console.log('监控');