'use strict';

let schema = sequelize.define('chapter', {
  id: {
    type: 'int(15)',
    field: 'id',
    allowNull: false,
    primaryKey: true,
    autoIncrement: false
  },
  book_id: {
    type: Sequelize.STRING(50),
    field: 'book_id',
  },
  chapter_list_id: {
    type: Sequelize.STRING(20),
    field: 'chapter_list_id',
  },
  name: {
    type: Sequelize.STRING(50),
    field: 'name',
  },
  content: {
    type: Sequelize.TEXT,
    field: 'content',
  },
  created_at: {
    type: Sequelize.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  },
  updated_at: {
    type: Sequelize.DATE,
    field: 'update_at',
    defaultValue: Sequelize.NOW,
  }
}, {
  tableName: 'chapter',
  indexes: [
    {
      fields: ['id']
    }
  ]
});

schema.sync();
module.exports = schema;