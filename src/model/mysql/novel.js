'use strict';

let Model = function() {
  this.director = require(srcFolder + '/schema/mysql/director');
  this.chapter = require(srcFolder + '/schema/mysql/chapter');
  this.taskPull = require(srcFolder + '/schema/mysql/task_pull_internet_update');
  this.book = require(srcFolder + '/schema/mysql/book');
};

module.exports = new Model();
