const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index: './index.axml'
  },
  module: {
    rules: [{
      test: /\.axml$/,
      use: [
        {
          loader: path.resolve(__dirname, '../lib/index.js')
        }
      ]
    }, {
      test: /\.scss$/,
      use: [
        {
          loader: 'sass-loader'
        }
      ]
    }]
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd'
  }
};
