module.exports = {

  baseUrl: 'http://www.biqudu.com',

  pages: [
    {
      url: 'http://www.biqudu.com/xuanhuanxiaoshuo/',
      tag: '玄幻小说',
    },{
      url: 'http://www.biqudu.com/xiuzhenxiaoshuo/',
      tag: '修真小说'
    },{
      url: 'http://www.biqudu.com/dushixiaoshuo/',
      tag: '都市小说',
    },{
      url: 'http://www.biqudu.com/lishixiaoshuo/',
      tag: '历史小说',
    }, {
      url: 'http://www.biqudu.com/wangyouxiaoshuo/',
      tag: '网游小说',
    }, {
      url: 'http://www.biqudu.com/kehuanxiaoshuo/',
      tag: '科幻小说',
    }, {
      url: 'http://www.biqudu.com/nvpinxiaoshuo/',
      tag: '女频小说'
    }
  ],

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
};
