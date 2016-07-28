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
	var notify = __webpack_require__(3)
	var loadJs = __webpack_require__(4)

	var ajax = __webpack_require__(5)

	loadJs('/dist/window.bundle.js')

	function reqScript(url){

	  if(url.indexOf('?') === -1){
	    url += '?noBanJS'
	  }else{
	    url += '&noBanJS'
	  }

	  var textReg = /\/\/wv@([\w]+\S)/g;

	  ajax(url).get().then(function (data) {

	    data = data.replace(textReg,function(all,matchV,index){
	      return 'variablesWatch("'+matchV+'",function(){return '+matchV+';})'
	    });

	    var s = document.createElement('script');
	    s.innerHTML = data;

	    document.body.appendChild(s);
	  })
	}

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
	        reqScript(m.message);
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
/* 2 */,
/* 3 */
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
/* 4 */
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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;;
	(function (root, factory) {
	  'use strict';
	  /* istanbul ignore next */
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  else if (typeof exports === 'object') {
	    exports = module.exports = factory();
	  }
	  else {
	    root.Ajax = factory();
	  }
	})(this, function () {
	  'use strict';
	  var $private = {};

	  var createMethods = function createMethods() {
	    return {
	      then: function () {
	      },
	      done: function () {
	      },
	      error: function () {
	      },
	      always: function () {
	      }
	    }
	  }
	  $private.XHRConnection = function XHRConnection(type, url, data) {
	    var methods = createMethods();

	    var xhr = new XMLHttpRequest();

	    xhr.open(type, url || '', true);

	    if (!(data instanceof FormData)) {
	      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	    }

	    xhr.addEventListener('readystatechange', $private.ready(methods), false);
	    xhr.send($private.objectToQueryString(data));

	    return $private.promises(methods);
	  };
	  $private.ready = function ready(methods) {

	    return function () {
	      var xhr = this;
	      var DONE = 4;
	      if (xhr.readyState === DONE) {
	        methods.always
	          .apply(methods, $private.parseResponse(xhr));
	        if (xhr.status >= 200 && xhr.status < 300) {
	          methods.done.apply(methods, $private.parseResponse(xhr));
	          methods.then.apply(methods, $private.parseResponse(xhr));
	        }
	        methods.error.apply(methods, $private.parseResponse(xhr));
	      }
	    }
	  };
	  $private.parseResponse = function parseResponse(xhr) {
	    var result;
	    try {
	      result = JSON.parse(xhr.responseText);
	    }
	    catch (e) {
	      result = xhr.responseText;
	    }
	    return [result, xhr];
	  };

	  $private.promises = function promises(methods) {
	    var allPromises = {};
	    Object.keys(methods).forEach(function (promise) {
	      allPromises[promise] = function (callback) {
	        return methods[promise] = callback
	      }
	    }, this);
	    return allPromises;
	  };

	  $private.objectToQueryString = function objectToQueryString(data) {
	    //console.log(data,typeof data,$private.isObject(data),data instanceof FormData);
	    return (data instanceof FormData) ? data :
	      $private.isObject(data) ? $private.getQueryString(data) : data;
	  };

	  $private.getQueryString = function getQueryString(object) {
	    return Object.keys(object).filter(function (key) {
	      return object[key] !== undefined && object[key] !== null;
	    }).map(function (item) {
	      var value = object[item];
	      if (typeof value === 'object') {
	        value = JSON.stringify(value);
	      }

	      return encodeURIComponent(item)
	        + '=' + encodeURIComponent(value);
	    }).join('&');
	  };

	  $private.isObject = function isObject(data) {
	    return '[object Object]' === Object.prototype.toString.call(data);
	  };


	  function Ajax(url) {
	    var $public = {};

	    $public.get = function get(data) {

	      return $private.XHRConnection('GET', url + '?' + $private.objectToQueryString(data));
	    };

	    $public.post = function post(data) {
	      return $private.XHRConnection('POST', url, data);
	    };

	    $public.put = function put(data) {
	      return $private.XHRConnection('PUT', url, data);
	    };

	    $public.delete = function del(data) {
	      return $private.XHRConnection('DELETE', url, data);
	    };

	    return $public;
	  }

	  window.ajax = Ajax;

	  return Ajax;
	});

/***/ }
/******/ ]);