'use strict';

require('./src/common/global');

let co = require('co');
let thunkify = require('thunkify-wrap');
let cheerio = require('cheerio');

let pages = [
  {
    uri: 'http://www.xxbiquge.com/xclass/1/1.html',
    tag: '玄幻玄奇',
  },{
    uri: 'http://www.xxbiquge.com/xclass/2/1.html',
    tag: '武侠仙侠'
  },{
    uri: 'http://www.xxbiquge.com/xclass/3/1.html',
    tag: '都市言情',
  },{
    uri: 'http://www.xxbiquge.com/xclass/4/1.html',
    tag: '历史军事',
  }, {
    uri: 'http://www.xxbiquge.com/xclass/5/1.html',
    tag: '科幻灵异',
  }, {
    uri: 'http://www.xxbiquge.com/xclass/6/1.html',
    tag: '网游竞技',
  }, {
    uri: 'http://www.xxbiquge.com/xclass/7/1.html',
    tag: '女频频道'
  }
];

let work = function* () {
  for (let i = 0, len = pages.length; i < len; i++) {
    yield createTask(pages[i].uri, pages[i].tag);
  }

  console.log('---create task done: ', new Date());

  setTimeout(function () {
    co(work()).then(function () {}, function(err) {
      if (err) {
        console.log(err);
        process.exit(0);
      }
    });
  }, 1000);
};

let createTask = function* (url, tag) {
  let data = null;
  let chapterIds = [];
  let result = [];
  try {
    data = yield thunkify(request)({
      uri: url,
      method: 'get',
      timeout: 1000 * 60
    });
  } catch (error) {
    throw new Error(error)
  }

  let $ = cheerio.load(data[0].body);
  let ul = $('div #main #newscontent .l ul')[0].children;
  for (let i = 0, len = ul.length; i < len; i++) {
    if (ul[i].name == 'li') {
      result.push(ul[i].children);
    }
  }
  let bookArr = [];
  for (let i = 0, len = result.length; i < len; i++) {
    chapterIds.push(result[i][1].children[0].attribs.href)
    bookArr.push({
      bookId:    result[i][0].children[1].attribs.href,
      bookName:  result[i][0].children[1].children[0].data,
      chapterId: result[i][1].children[0].attribs.href
    });
  }

  for (let i = 0, len = bookArr.length; i < len; i++) {
    let book = bookArr[i];
    try {
      yield model.mysql.novel.taskPull.findOrCreate({
        where: {
          bookId: book.bookId.split('/')[1],
          chapterId: book.chapterId,
          tag: tag
        },
        defaults: {
          bookId: book.bookId.split('/')[1],
          bookName: book.bookName,
          chapterId: book.chapterId,
          tag: tag,
          status: 'pending'
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  data = null;
  result = null;
  bookArr = null;
  console.log('----create task done: ', tag);
}

co(work()).then(function(){}, function(err) {
  console.log(err);
  process.exit(0)
})