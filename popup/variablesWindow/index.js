/**
 * Created by zyg on 16/7/27.
 */
console.log('variables window')

var VW = 'VW'

var port = chrome.runtime.connect();

port.postMessage({
  type:VW
})