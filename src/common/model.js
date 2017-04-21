'use strict';

let fs = require('fs');
let path = require('path');

var exports = {};
exports.mysql = {};
exports.mongo = {};
exports.postgresql = {};

var dir = fs.readdirSync(__dirname + '/../model/mysql/');
for (let i = 0; i < dir.length; i++) {
  if (path.extname(dir[i]) !== '.js') continue;
  exports['mysql'][_.toCamel(path.basename(dir[i], '.js'))] = require(__dirname + '/../model/mysql/' + dir[i]);
}

var dir = fs.readdirSync(__dirname + '/../model');
for (let i = 0; i < dir.length; i++) {
  if (path.extname(dir[i]) !== '.js') continue;
  exports[_.toCamel(path.basename(dir[i], '.js'))] = require(__dirname + '/../model/' + dir[i]);
}

module.exports = exports;
