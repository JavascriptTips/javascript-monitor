var extensionId = 'hbpnmcfijddjekpmkdiippnmcgkpclia';

document.querySelector('.new-window').onclick = function () {
  chrome.windows.create({
    top: 110,
    left: 0,
    width: 230,
    height: 300,
    type: 'popup',
    url: 'logWindow/newWindow.html'
  }, function (win) {
    console.log(win)
  });
};


//chrome.tabs.query({
//  active:true,
//}, function (tabs) {
//  tabs.map(function (tab) {
//    chrome.tabs.executeScript({
//      file:'inject/contentScript.js'
//    }, function () {
//      console.log('exe');
//    })
//  });
//});