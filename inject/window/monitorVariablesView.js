require('./monitorVariablesView.css')
var _ = require('lodash')

var wvContainer = document.createElement('div');
wvContainer.className = 'wv-container'
document.body.appendChild(wvContainer)

var variablesList = [];

function renderList(container,list){

  list.forEach(function (obj) {

    var one = document.createElement('div');

    var data = obj.getData();

    if(_.isObject(data)){
      var title = document.createElement('p')
      title.className = 'title'
      title.innerText = obj.name;

      one.appendChild(title)

      Object.getOwnPropertyNames(data).forEach(function (k) {
        var kv = document.createElement('p')
        kv.className = 'child-v'
        kv.innerText = k + ':' + data[k]
        one.appendChild(kv)
      })

    }else{
      var value = document.createElement('p')
      value.innerText =  obj.name + ':' + data
      one.appendChild(value)
    }

    container.appendChild(one)
  })
}


module.exports = {
  render:function(variables,i){

    variablesList[i] = variables;

    wvContainer.innerHTML = ''

    wvContainer.style.visibility = 'visible';

    renderList(wvContainer,variablesList)
  }
}