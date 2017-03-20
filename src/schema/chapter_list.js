'use strict';

let Sequelize = require('sequelize');

let sequelize = new Sequelize('novel', 'root', 'root', {
  host: 'localhost',
  port: 1000,
  dialect: 'mysql',
  logging: undefined,
  pool: {
    max: 10,
  },
  timezone: '+08:00',

});

let schema = sequelize.define('chapter_list',{
  id: {
    type: 'int(15)',
    field: 'id',
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  author_id: {
    type: Sequelize.STRING(50),
    field: 'author_id',
    allowNull: false,
  },
  book_id: {
    type: Sequelize.STRING(50),
    field: 'book_id',
    allowNull: false,
  },
  chapter_id: {
    type: Sequelize.STRING(20),
    field: 'chapter_id',
    allowNull: false,
  },
  chapter_name: {
    type: Sequelize.STRING(100),
    field: 'chapter_name',
    allowNull: false,
  },
  chapter_link: {
    type: Sequelize.STRING(100),
    field: 'chapter_link',
    allowNull: false,
  },
  created_at: {
    type: Sequelize.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    type: Sequelize.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'chapter_list',
  indexes: [
    {
      fields: ['book_id']
    }, {
      fields: ['chapter_id'],
    }, {
      fields: ['chapter_link'],
    }
  ]
});


schema.sync();
module.exports = schema;
