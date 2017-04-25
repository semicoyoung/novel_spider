//书的目录
'use strict';

let schema = dbs.NOVEL.define('director', {
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
  bookName: {
    type: Sequelize.STRING,
    field: 'book_name',
  },
  chapterId: {
    unique: true,
    type: Sequelize.STRING,
    field: 'chapter_id',
    allowNull: false,
  },
  chapterTitle: {
    type: Sequelize.STRING,
    field: 'chapter_title',
    allowNull: false,
  },
  authorId: {
    type: Sequelize.STRING,
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
  }
}, {
  tableName: 'director',
  createdAt: false,
  updatedAt: false,
  indexes: [
    {
      fields: ['book_id'],
    },
    {
      fields: ['chapter_id'],
    }
  ]
});

schema.sync();
module.exports = schema;
