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
    unique: true,
  },
  bookName: {
    type:  Sequelize.STRING,
    field: 'book_name',
  },
  tag: {
    type:  Sequelize.STRING,
    field: 'tag',
  },
  bookIntroduction: {
    type: Sequelize.TEXT,
    field: 'book_introduction',
  },
  bookImageUrl: {
    type: Sequelize.STRING,
    field: 'book_image_url',
  },
  authorId: {
    type: Sequelize.INTEGER,
    field: 'author_id',
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
},{
  tableName: 'book',
  createdAt: false,
  updatedAt: false,
  indexes: [
    {
      fields: ['book_id']
    }, {
      fields: ['book_name']
    }
  ]
});

schema.sync();
module.exports = schema;
