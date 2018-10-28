/* global require, __dirname, module */
const path = require("path");
const commonConfig = require("./webpack.config");

commonConfig.mode = "development";
commonConfig.entry = "./specs/index.js";
commonConfig.devtool = "inline-source-map";
commonConfig.plugins = [];

commonConfig.module.rules.unshift({
  test: /\.js$/,
  use: {
    loader: "istanbul-instrumenter-loader",
    options: { esModules: true }
  },
  enforce: "post",
  include: path.resolve(__dirname, "./src")
});

module.exports = commonConfig;
