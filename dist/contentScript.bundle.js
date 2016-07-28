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
	 * Created by zyg on 16/7/14.
	 */
	var msgType = __webpack_require__(1)
	var notify = __webpack_require__(2)
	var loadJs = __webpack_require__(3)

	loadJs('/dist/window.bundle.js')

	//连接信息，监听dom
	document.addEventListener('DOMContentLoaded', function () {

	  var myNotify = notify.createNotify('网络500')

	  var body = document.body;

	  var port = chrome.runtime.connect();
	  port.onDisconnect.addListener(function () {
	    console.log('断开了');
	  });
	  port.onMessage.addListener(function (m) {

	    switch (m.type){
	      case msgType.VW:
	        location.reload();
	        break;
	      case  msgType.BAN_JS:
	        console.log(m.message)
	        break;
	    }

	    if(m.code500){
	      notify.createNotificationObj(function(){
	        myNotify(m.code500.url, m.code500.code)
	      })
	    }
	  })

	  function sendMessage(gaStr) {
	    port.postMessage(gaStr);
	  }

	  sendMessage('init');

	  body.addEventListener('mouseover', onMouseOver);
	  function onMouseOver(e) {
	    var ga = e.target.getAttribute('data-ga');
	    if (!ga) {
	      return;
	    }
	    //console.log(ga);

	    sendMessage({
	      title:document.title,
	      ga:ga
	    });
	  }
	});


	////代理
	//var _XMLHttpRequest = window.XMLHttpRequest;
	//window.XMLHttpRequest = function(){
	//  var req = new _XMLHttpRequest();
	//
	//  var _open = req.open;
	//  var _send = req.send;
	//
	//  req.open = function(type, url, async){
	//    console.log('req:',url);
	//    _open.apply(req, arguments)
	//  };
	//  req.send = function (data) {
	//    console.log('req:',data);
	//    _send.apply(req,arguments)
	//  };
	//
	//  return req;
	//};

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
	 * Created by zyg on 16/7/14.
	 */
	var notifyArr = []

	function createNotificationObj(cb) {
	  var permission = Notification.permission
	  if(permission === 'granted'){
	    cb(true)
	  }else{
	    Notification.requestPermission(function(p){
	      if(p === 'granted'){
	        cb(true)
	      }else{
	        cb(false)
	      }
	    })
	  }
	}
	function clear(notification){
	  notifyArr.push(notification)
	  if(notifyArr.length > 3 ){
	    notifyArr.shift().close()
	  }
	}


	function createNotify(title){
	  return function(pre,msg){
	    var notification = new Notification(title,{
	      body:pre+':'+msg,
	      //icon:'../images/red.png'
	    })

	    clear(notification)
	  }
	}

	module.exports = {
	  createNotificationObj:createNotificationObj,
	  clear:clear,
	  createNotify:createNotify,
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Created by zyg on 16/7/27.
	 */
	module.exports = function loadJs(jsPath){
	  var s = document.createElement('script');
	  s.type = 'text/javascript';

	  s.src = chrome.extension.getURL(jsPath);
	  (document.head || document.documentElement).appendChild(s);
	}

/***/ }
/******/ ]);