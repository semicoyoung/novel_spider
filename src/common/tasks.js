'use strict';

let fs = require('fs');
let path = require('path');

var dir = fs.readdirSync(__dirname + '/../tasks');
for (let i = 0; i < dir.length; i++) {
  if (path.extname(dir[i]) !== '.js') continue;
  module.exports[_.toCamel(path.basename(dir[i], '.js'))] = require(__dirname + '/../tasks/' + dir[i]);
}
