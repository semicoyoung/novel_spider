'use strict';

let Model = function() {
  this.director = require(srcFolder + '/schema/mysql/director');
  this.chapter = require(srcFolder + '/schema/mysql/chapter');
};

module.exports = new Model();
