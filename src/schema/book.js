'use strict';

let schema = sequelize.define('book', {
  id: {
    type: Sequelize.STRING,
    field: 'id',
    autoIncrement: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    field: 'name',
  },
  author_id: {
    type: Sequelize.STRING(20),
    field: 'author_id',
  },
  created_at: {
    type: Sequelize.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    type: Sequelize.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'book',
  indexes: [
    {
      fields: ['id']
    }, {
      fields: ['name'],
    }, {
      fields: ['updated_at'],
    }, {
      fields: ['created_at'],
    }
  ]
});

schema.sync();
module.exports = schema;