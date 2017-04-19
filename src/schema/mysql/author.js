// 书的作者的信息
'use strict';

let schema = dbs.novel.define('author', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    field: 'name',
    allowNull: false,
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
      fields: ['name'],
    }
  ]
});

schema.sync();
module.exports = schema;
