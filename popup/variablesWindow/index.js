/**
 * Created by zyg on 16/7/27.
 */
console.log('variables window')
var msgType = require('../../inject/common/msgType')

var port = chrome.runtime.connect();

port.postMessage({
  type:msgType.VW
})