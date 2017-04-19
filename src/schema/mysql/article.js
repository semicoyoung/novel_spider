// 每一章的文本
'use strict';

let schema = dbs.novel.define('article', {
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
  authorId: {
    type: Sequelize.INTEGER,
    field: 'author_id',
  },
  bookId: {
    type: Sequelize.INTEGER,
    field: 'book_id',
  },
  directorId: {
    type: Sequelize.INTEGER,
    field: 'director_id',
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
  tableName: 'article',
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