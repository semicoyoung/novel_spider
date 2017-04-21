module.exports = {

  baseUrl: 'http://www.biquge.com',

  mongoDb: {
    host: 'localhost',
    port: 27017,
    username: undefined,
    password: undefined,
    database: 'novel',
  },

  dbNovel : {
    host : 'localhost',
    port : '3306',
    database : 'novel',
    username : 'root',
    password : '',
    pool : 10
  },

  cache: {
    host: 'dev.smartstudy.com',
    port: 6379,
    expire: 60,
    mrExpire: 10,
  },
};
