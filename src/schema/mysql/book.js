//书的信息
'use strict';

let schema = dbs.NOVEL.define('book', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    autoIncrement: true,
    primaryKey: true
  },
  bookId: {
    type: Sequelize.STRING,
    field: 'book_id',
  },
  tag: {
    type:  Sequelize.STRING,
    field: 'tag',
  },
  name: {
    type:  Sequelize.STRING,
    field: 'name',
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
  },
  authorId: {
    type: Sequelize.INTEGER,
    field: 'author_id',
  },
  categoryId : {
    type: Sequelize.INTEGER,
    field: 'category_id',
  },
},{
  tableName: 'book',
  createdAt: false,
  updatedAt: false,
  indexes: [
    {
      fields: ['name']
    }
  ]
});

schema.sync();
module.exports = schema;
