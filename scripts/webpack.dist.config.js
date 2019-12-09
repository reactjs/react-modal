const webpack = require('webpack');
const path = require('path');
const defaultConfig = require('./defaultConfig');

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
};
const reactDOMExternal = {
  root: 'ReactDOM',
  commonjs2: 'react-dom',
  commonjs: 'react-dom',
  amd: 'react-dom'
};

module.exports = {
  ...defaultConfig,
  mode: 'production',
  entry: {
    'react-modal': path.resolve(__dirname, '../src/index.js'),
    'react-modal.min': path.resolve(__dirname, '../src/index.js')
  },
  externals: {
    'react': reactExternal,
    'react-dom': reactDOMExternal
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    libraryTarget: 'umd',
    library: 'ReactModal'
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
