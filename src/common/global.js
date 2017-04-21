'use strict';

global.srcFolder = __dirname + '/..';
global.uuid = require('node-uuid');
global.util = require('util');
global.config = require('./config');
global.constant = require('./constant');
global.co = require('co');
global.Sequelize = require('sequelize');
global._ = require('lodash');
global.func = require('./func');

global.dbs = require('./dbs.js');

global.model = require('./model');
global.thunkify = require('thunkify-wrap');
global.request = require('request');
global.stableStringify = require('json-stable-stringify');

// 全局错误
global.errors = require('./errors');
global.Exception = function(code, msg) {
  this.code = code;
  this.msg = msg || errors[code];
  this.stack = new Error(this.code + ': ' + this.msg).stack;
};
