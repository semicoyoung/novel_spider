module.exports = {
  baseUrl: 'http://www.biquge.com',

  dbNovel: {
    host : 'localhost',
    port : '3306',
    database : 'novel',
    username : 'root',
    password : '',
    pool : 10
  },

  cache: {
    host: 'localhost',
    port: 6379,
    expire: 60,
    mrExpire: 10,
  },
};
