var extensionId = 'hbpnmcfijddjekpmkdiippnmcgkpclia';

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

  chrome.windows.create({
    top: 110,
    left: 0,
    width: 230,
    height: 300,
    type: 'popup',
    url: 'popup/variablesWindow/index.html'
  }, function (win) {

    chrome.windows.getAll({
      windowTypes:['popup']
    }, function (windowArr) {

      windowArr.forEach(function (winObj) {
        if(winObj.id !== win.id){
          chrome.windows.remove(winObj.id)
        }
      })
    })
  })
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