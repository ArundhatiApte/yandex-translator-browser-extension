"use strict";

const createPath = require("path").join;


const env = process.env;
const willMinify = env.willMinifyCode === "1";
const pathToSrcDir = env.pathToSrcDir;

module.exports = {
  entry: {
    background: createPath(pathToSrcDir, "background/script.js"),
    popup: createPath(pathToSrcDir, "popupPage/js/script.js"),
    settings: createPath(pathToSrcDir, "settingsPage/js/script.js"),
    translatingPageScript: createPath(pathToSrcDir, "contentScripts/translatingPageScript/script.js"),
  },
  optimization: willMinify
    ? {
      minimize: true,
      minimizer: [new (require("terser-webpack-plugin"))({ include: /\.js$/ })]
    } : {
      minimize: false,
      moduleIds: "named"
    },
  stats: "errors-only"
};
