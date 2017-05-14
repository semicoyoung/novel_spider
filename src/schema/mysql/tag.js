// 书的分类
'use strict';

let schema = dbs.NOVEL.define('tag', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    autoIncrement: true,
    primaryKey: true
  },
  tagName: {
    type: Sequelize.STRING,
    field: 'tag_name',
  },
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'tag',
  createdAt: false,
  updatedAt: false,
  indexes: [
    {
      fields: ['id'],
    }
  ]
});

schema.sync();
module.exports = schema;
