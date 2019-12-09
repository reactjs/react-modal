const path = require('path');

module.exports = {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './examples/__build__'),
    publicPath: '/__build__/'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader' } }
    ]
  },
  resolve: {
    alias: {
      "react-modal": path.resolve(__dirname, "../src")
    }
  }
};
