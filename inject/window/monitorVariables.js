/**
 * Created by zyg on 16/7/25.
 */
var extensionId = 'hbpnmcfijddjekpmkdiippnmcgkpclia';
var _ = require('lodash')
var monitorVariablesView = require('./monitorVariablesView')

var watchMap = {};

function equals(pre,next){
  var r1 = pre !== next;

  if(r1 && _.isObject(pre)){

    return Object.getOwnPropertyNames(pre).every(function(k){
      return pre[k] === next[k]
    }) && Object.getOwnPropertyNames(next).every(function(k){
        return next[k] === pre[k]
      })
  }else{
    return r1
  }
}


var raf;
function refresh(){
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(function(){

    Object.keys(watchMap).forEach(function(k,i){
      var variables = watchMap[k];

      monitorVariablesView.render(variables,i)
    })

    refresh()
  })
}

window.variablesWatch = function(dataName,getData){

  var dataNameKey = dataName + Date.now()

  watchMap[dataNameKey] = {
    name:dataName,
    getData:getData
  }

  refresh()
}
