var path = require('path');


module.exports = {
  entry: {
    popup: './popup.js',
    variablesWindow:'./popup/variablesWindow/index.js',
    background:'./bridge/background.js',
    contentScript:'./inject/contentScript.js',
    window:'./inject/window/index.js'
  },
  externals: {
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    publicPath: 'dist',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: []
  },
  devTools: 'source-map'
};