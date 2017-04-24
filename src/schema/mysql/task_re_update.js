'use strict';

let schema = dbs.NOVEL.define('task_re_update', {
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
  chapterId: {
    type: Sequelize.STRING,
    field: 'chapter_id',
  },
  chapterTitle: {
    type: Sequelize.STRING,
    field: 'chapter_title',
  },
  status: {
    type: Sequelize.STRING,
    field: 'status',
  }
}, {
  tableName: 'task_re_update',
  createdAt: false,
  updatedAt: false,
  indexes: [
    {
      fields: ['book_id']
    },{
      fields: ['chapter_id']
    }
  ]
});

schema.sync();
module.exports = schema;
