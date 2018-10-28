/* global require, __dirname, module, process */
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

const BUILDING_MODE = process.env.NODE_ENV || "development";
const EXAMPLES_DIR = path.resolve(__dirname, "examples");

const isDirectory = dir => fs.lstatSync(dir).isDirectory();

const buildEntries = rootPath => fs.readdirSync(
  rootPath
).reduce((entries, dir) => {
  if (dir === "build")
    return entries;

  var isDraft = dir.charAt(0) === "_";

  if (!isDraft && isDirectory(path.join(rootPath, dir)))
    entries[dir] = path.join(rootPath, dir, "app.js");

  return entries;
}, {});

const configuration = {
  mode: BUILDING_MODE,
  entry: buildEntries(EXAMPLES_DIR),
  output: {
    filename: "[name].js",
    chunkFilename: "[id].chunk.js",
    path: path.resolve(__dirname, "./examples/__build__"),
    publicPath: "/__build__/"
  },
  devtool: 'inline-source-map',
  devServer: { contentBase: "./examples" },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: { loader: "babel-loader" }
    }]
  },
  resolve: {
    alias: { "react-modal": path.resolve(__dirname, "./src") }
  },
  plugins: [new webpack.LoaderOptionsPlugin({ debug: true })]
};

module.exports = configuration;
