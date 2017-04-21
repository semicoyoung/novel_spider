// 每一章的文本
'use strict';

let schema = dbs.NOVEL.define('chapter', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    autoIncrement: true,
    primaryKey: true
  },
  chapterTitle: {
    type: Sequelize.STRING,
    field: 'chapter_title',
    allowNull: false,
  },
  chapterId: {
    type: Sequelize.STRING,
    field: 'chapter_id',
    allowNull: false,
    unique: true
  },
  content: {
    type: Sequelize.TEXT,
    field: 'content',
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
  tableName: 'chapter',
  createdAt: false,
  updatedAt: false,
  indexes: [
    {
      fields: ['chapter_id'],
    }
  ]
});

schema.sync();
module.exports = schema;