console.log('new window');
var currentTitle = document.querySelector('.current-title');
var finalGa = document.querySelector('.final-ga');

var record = document.querySelector('#record');

currentTitle.innerText = document.title;

var port = chrome.runtime.connect();

var  title = '';

var count = 0;

port.onMessage.addListener(function (m) {
  console.log(m);

  if(m.ga) {
    title = m.ga.title;
    currentTitle.innerText = title;

    finalGa.innerText = title + '|' + m.ga.ga;
  }
  if(m.req){
    record.value = title + '|' + m.req.ga + '\n' + '-------'+(++count)+'------ \n' + record.value;
  }
});

port.postMessage('from newWindow');
