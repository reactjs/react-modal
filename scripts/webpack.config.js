const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const defaultConfig = require('./defaultConfig'); 

var EXAMPLES_DIR = path.resolve(__dirname, '../examples');

function isDirectory(dir) {
  return fs.lstatSync(dir).isDirectory();
}

function buildEntries() {
  return fs.readdirSync(EXAMPLES_DIR).reduce(function (entries, dir) {
    if (dir === 'build')
      return entries;

    var isDraft = dir.charAt(0) === '_';

    if (!isDraft && isDirectory(path.join(EXAMPLES_DIR, dir)))
      entries[dir] = path.join(EXAMPLES_DIR, dir, 'app.js');

    return entries;
  }, {});
}

module.exports = {
  ...defaultConfig,
  entry: buildEntries(),
};
