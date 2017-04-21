'use strict';

let xaPlugin = require('sequelize-xa-plugin');

exports.NOVEL = {};
exports.NOVEL = new Sequelize(config.dbNovel.database, config.dbNovel.username, config.dbNovel.password, {
  dialect: 'mysql',
  host: config.dbNovel.host,
  port: config.dbNovel.port,
  timezone: '+08:00',
  logging: undefined,
  pool: {
    maxConnections: config.dbNovel.pool
  }
});

module.exports = exports;
