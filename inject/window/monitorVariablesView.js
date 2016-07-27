require('./monitorVariablesView.css')
var _ = require('lodash')
var body = document.body;

var wvContainer = document.createElement('div');
wvContainer.className = 'wv-container'

var variablesList = [];

function renderList(container,list){

  list.forEach(function (obj) {

    var one = document.createElement('div');

    var title = document.createElement('p')
    title.innerText = obj.name;

    one.appendChild(title)

    var data = obj.getData();

    if(_.isObject(data)){

      Object.getOwnPropertyNames(data).forEach(function (k) {
        var kv = document.createElement('p')
        p.innerText = k + ':' + data[k]
        one.appendChild(kv)
      })

    }else{
      var value = document.createElement('p')
      one.appendChild(value)
    }

    container.appendChild(one)
  })
}


module.exports = {
  render:function(variables,i){

    variablesList[i] = variables;

    wvContainer.innerHTML = ''

    renderList(wvContainer,variablesList)
  }
}