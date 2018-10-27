/* global require, __dirname, module, process */
const webpack = require("webpack");
const path = require("path");

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
  mode: "production",
  entry: {
    "react-modal": "./src/index.js",
    "react-modal.min": "./src/index.js"
  },
  externals: {
    "react": reactExternal,
    "react-dom": reactDOMExternal
  },
  output: {
    filename: "[name].js",
    chunkFilename: "[id].chunk.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    libraryTarget: "umd",
    library: "ReactModal"
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ],
  module: {
    rules: [
      { test: /\.js?$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" }
      }
    ]
  }
};
