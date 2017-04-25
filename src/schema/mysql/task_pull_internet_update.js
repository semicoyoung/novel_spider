'use strict';

let schema = dbs.NOVEL.define('task_pull_internet_update', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    autoIncrement: true,
    primaryKey: true,
  },
  bookId: {
    type: Sequelize.STRING,
    field: 'book_id',
  },
  chapterId: {
    type: Sequelize.STRING,
    field: 'chapter_id',
  },
  tag: {
    type: Sequelize.STRING,
    field: 'tag',
  },
  status: {
    type: Sequelize.STRING,
    field: 'status',
  },
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'task_pull_internet_update',
  createdAt: false,
  updatedAt: false,
  indexes: [
    {
      fields: ['book_id'],
    }, {
      fields: ['chapter_id'],
    }
  ]
});

schema.sync();
module.exports = schema;
