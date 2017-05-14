// 书的作者的信息
'use strict';

let schema = dbs.NOVEL.define('author', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    autoIncrement: true,
    primaryKey: true
  },
  authorName: {
    type: Sequelize.STRING(50),
    field: 'author_name',
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
  tableName: 'author',
  createdAt: false,
  updatedAt: false,
  indexes: [
    {
      fields: ['id'],
    }, {
      fields: ['author_name'],
    }
  ]
});

schema.sync();
module.exports = schema;
