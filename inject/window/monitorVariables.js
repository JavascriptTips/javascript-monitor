/**
 * Created by zyg on 16/7/25.
 */
var extensionId = 'hbpnmcfijddjekpmkdiippnmcgkpclia';
var _ = require('lodash')
var monitorVariablesView = require('./monitorVariablesView')
var msgType = require('../common/msgType')

var watchMap = {};

//function equals(pre,next){
//  var r1 = pre !== next;
//
//  if(r1 && _.isObject(pre)){
//
//    return Object.getOwnPropertyNames(pre).every(function(k){
//      return pre[k] === next[k]
//    }) && Object.getOwnPropertyNames(next).every(function(k){
//        return next[k] === pre[k]
//      })
//  }else{
//    return r1
//  }
//}


var raf,
  count = 0
function refresh(){
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(function(){

    if((count++)%240 ===0) {
      Object.keys(watchMap).forEach(function (k, i) {
        var variables = watchMap[k];

        monitorVariablesView.render(variables, i)
      })
    }

    refresh()
  })
}

var port = chrome.runtime.connect(extensionId)
port.onMessage.addListener(function (m) {

  console.log(m);

  switch (m.type){
    case msgType.BAN_JS:
      reqScript(m.message);
      break;
  }
})

window.variablesWatch = function(dataName,getData){

  var dataNameKey = dataName + Date.now() + Object.keys(watchMap).length

  watchMap[dataNameKey] = {
    name:dataName,
    getData:getData
  }

  refresh()
}
//
//i=0;
//variablesWatch('data',function(){return i++})
//
//variablesWatch('data',function(){
//  return {
//    v:i++
//  }
//})