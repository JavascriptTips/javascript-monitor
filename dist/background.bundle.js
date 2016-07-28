/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by zyg on 16/3/31.
	 */
	var msgType =__webpack_require__(1)
	var sendMsgToTab = __webpack_require__(2)

	var openVariablesWatch = false;

	chrome.runtime.onConnect.addListener(function (port) {
	  sendMsgToTab.addTab(port)

	  port.onMessage.addListener(function (m) {

	    console.log('m',m);

	    switch (m.type){

	      //开关变量监控
	      case msgType.VW:
	        openVariablesWatch = !openVariablesWatch;
	        console.log('openVariablesWatch:',openVariablesWatch);
	        sendMsgToTab.broadcast(m,port);
	        break;
	      default:
	        sendMsgToTab.broadcast({
	          ga:m
	        },port);
	    }
	  });

	  port.onDisconnect.addListener(function () {
	    sendMsgToTab.delTab(port)
	  });
	});


	var urlBeforeHandlers = [
	  {
	    test: function (details) {
	      var url = details.url;

	      return /\.js/.test(url) &&
	        !/chrome-extension/.test(url) &&
	        !/noBanJS/.test(url) &&
	        openVariablesWatch
	    },
	    handler: function (details) {

	      sendMsgToTab.sendByTabId(details.tabId,msgType.BAN_JS,details.url)

	      return {
	        redirectUrl: 'javascript:'
	      }
	    }
	  }
	];

	var urlCompletedHandlers = [{
	  test: function (details) {
	    return /\/use\.jpg/.test(details.url)
	  },
	  handler: function (details) {

	    var url = details.url;

	    var urlObj = new URL(url);
	    var searchObj = urlObj.search.substr(1).split('&').map(function (kv) {
	      return kv.split('=').map(function (str) {
	        return decodeURIComponent(str);
	      });
	    }).reduce(function (pre, kvArr) {
	      var kvObj = {};
	      kvObj[kvArr[0]] = kvArr[1];
	      return Object.assign(pre, kvObj);
	    }, {});

	    console.log('ajax:', searchObj.tag);

	    sendMsgToTab.broadcast({
	      req: {
	        ga: searchObj.tag,
	      }
	    });
	  }
	}, {
	  test: function (details) {
	    var code = details.statusCode;
	    return code >= 500
	  },
	  handler: function (details) {
	    var url = details.url;
	    var code = details.statusCode;

	    sendMsgToTab.broadcast({
	      code500: {
	        url: url,
	        code: code,
	      }
	    })
	  }
	}]


	chrome.webRequest.onBeforeRequest.addListener(function (details) {
	  var r =  urlBeforeHandlers.reduce(function (v, obj) {
	    if (obj.test(details)) {
	      v = obj.handler(details)
	    }
	    return v;
	  }, undefined)
	  return r;

	}, {urls: ["<all_urls>"]},['blocking']);

	chrome.webRequest.onCompleted.addListener(function (details) {
	  urlCompletedHandlers.forEach(function (obj) {
	    if (obj.test(details)) {
	      obj.handler(details)
	    }
	  })

	}, {urls: ["<all_urls>"]});

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Created by zyg on 16/7/27.
	 */
	module.exports = {
	  VW:'VW',
	  BAN_JS:'ban_js',
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ }
/******/ ]);