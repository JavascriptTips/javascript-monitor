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

	var msgType = __webpack_require__(1)

	//
	//document.querySelector('.new-window').onclick = function () {
	//  chrome.windows.create({
	//    top: 110,
	//    left: 0,
	//    width: 230,
	//    height: 300,
	//    type: 'popup',
	//    url: 'popup/logWindow/newWindow.html'
	//  }, function (win) {
	//    console.log(win)
	//  });
	//};

	document.querySelector('.variables-monitor').onclick = function () {

	  var port = chrome.runtime.connect();

	  port.postMessage({
	    type:msgType.VW
	  })
	};

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

/***/ }
/******/ ]);