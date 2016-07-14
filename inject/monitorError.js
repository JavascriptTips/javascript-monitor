//load notify
var notify = createNotify('出错啦')

window.addEventListener('error',function (err) {
  var file = err.filename.substr(err.filename.lastIndexOf('/')+1);

  createNotificationObj(function () {
    notify(file,err.message)
  });

  console.error('监控:',err);
});

console.log('监控');