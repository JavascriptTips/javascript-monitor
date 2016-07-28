/**
 * Created by zyg on 16/7/28.
 */

var portArrCache = [];

var tabMsgCache = {

}

function saveMsg(tabId,type,msg){
  if(!tabMsgCache[tabId]){
    tabMsgCache[tabId] = []
  }

  tabMsgCache[tabId].push({
    type:type,
    message:msg,
  })
}

function consumeMsg(tabId){
  if(!tabMsgCache[tabId]) {
    return false;
  }
  portArrCache.forEach(function(port){
    if(port.sender.tab){
      if(port.sender.tab.id === tabId){

        tabMsgCache[tabId] = tabMsgCache[tabId].filter(function(messageObj){
          port.postMessage(messageObj)
          return false;
        })
      }
    }
  })
}

function sendByTabId(tabId,type,msg){

  saveMsg(tabId,type,msg)

  consumeMsg(tabId);
}

function addTab(port){
  portArrCache.push(port)

  //只有浏览器的一个tab才有[tab]这个属性
  if(port.sender.tab){
    consumeMsg(port.sender.tab.id)
  }
}

function delTab(port){
  console.log('delTab',port)
  portArrCache = portArrCache.filter(function (portCache) {
    return portCache !== port;
  })
}

function broadcast(m,sender){
  portArrCache.filter(function (p) {
    return p !== sender
  }).forEach(function (p) {
    console.log(m);
    p.postMessage(m);
  });
}

module.exports = {
  addTab:addTab,
  delTab:delTab,
  sendByTabId:sendByTabId,
  broadcast:broadcast
}