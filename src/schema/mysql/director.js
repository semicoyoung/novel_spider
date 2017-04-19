//书的目录
'use strict';

let schema = dbs.novel.define('director', {
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
      fields: ['name'],
    }
  ]
});

module.exports = {};
