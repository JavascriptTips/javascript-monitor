/**
 * Created by zyg on 16/7/27.
 */
module.exports = function loadJs(jsPath){
  var s = document.createElement('script');
  s.type = 'text/javascript';

  s.src = chrome.extension.getURL(jsPath);
  (document.head || document.documentElement).appendChild(s);
}