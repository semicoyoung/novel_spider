'use strict';
require('./src/common/global');

let express = require('express');
let request = require('request');
let co = require('co');
let thunkify = require('thunkify-wrap');
let cheerio = require('cheerio');
let app = express();
let redis = require('redis');
app.use(require('compression')());
app.use(require('connect-timeout')(600 * 1000, {respond: false}));

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('cookie-parser')());

let baseUrl = 'http://www.biquge.com';

process.on('uncaughtException', function (err) {
    console.error('Global:');
    console.error(err);
    process.exit(0);
});

let port = 3000;
app.listen(port);
console.log('server start up on port: ',port);

let pages = [
  {
    uri: 'http://www.biquge.com/xuanhuanxiaoshuo/',
    tag: '玄幻小说',
  },{
    uri: 'http://www.biquge.com/xiuzhenxiaoshuo/',
    tag: '修真小说'
  },{
    uri: 'http://www.biquge.com/dushixiaoshuo/',
    tag: '都市小说',
  },{
    uri: 'http://www.biquge.com/lishixiaoshuo/',
    tag: '历史小说',
  }, {
    uri: 'http://www.biquge.com/wangyouxiaoshuo/',
    tag: '网游小说',
  }, {
    uri: 'http://www.biquge.com/kehuanxiaoshuo/',
    tag: '科幻小说',
  }, {
    uri: 'http://www.biquge.com/nvpinxiaoshuo/',
    tag: '女频小说'
  }
];

// 获取书的目录页的数据：书的目录
let getChapterList = function* (bookId) {
  let uri = baseUrl + '/' + bookId;
  let chapters = [];
  let data;
  try {
    data = yield thunkify(request)({
      uri: uri,
      method: 'get'
    });
  } catch (err) {
    console.log('get chapter list error: ', err);
    return chapters;
  }

  let $ = cheerio.load(data[0].body);
  let bookName = $('div .box_con #maininfo #info h1')[0].children[0].data;
  let inner = $('div .box_con #list')['0'].children[1].children;
  for (let i = 0, len = inner.length; i < len; i++) {
    if (inner[i].type && inner[i].type == 'tag' && inner[i].name  && inner[i].name == 'dd') {
      chapters.push({
        bookId: bookId,
        bookName: bookName,
        chapterId: inner[i].children[1].attribs.href,
        chapterTitle: inner[i].children[1].children[0].data
      });
    }
  }

  console.log('----getChapterList done');

  return chapters;
};

// 获取书的某一章的页面的数据： 书的某一章的内容
let getArticleContent = function* (articleId) {
  let uri = baseUrl + '/' + articleId;
  let data;
  try {
    data = yield thunkify(request)({
      uri: uri,
      method: 'get',
      timeout: 1000 * 60
    });
  } catch (error) {
    console.log('---error: ', error);
    return '';
  }

  let $ = cheerio.load(data[0].body);

  let contents = $('div .content_read .box_con #content').text();
  console.log('-----getArticleContent');
  return contents;
}

let workUpdateArticle = function* (bookId) {
  let chapterInfo = yield model.mysql.novel.director.findAll({where: {bookId: bookId}, raw: true});
  if (!chapterInfo || !chapterInfo.length) {
    return ;
  }

  let chapterObj = {};
  for (let i = 0, len = chapterInfo.length; i < len; i++) {
    chapterObj[chapterInfo[i].chapterId] = chapterInfo[i];
  }

  let chapterIds = Object.keys(chapterObj);

  let existsChapter = yield model.mysql.novel.chapter.findAll({where: {chapterId: {$in: chapterIds}}, attributes: ['chapterId', 'chapterId'], raw:true});
  let existsChapterIds = [];
  for (let i = 0, len = existsChapter.length; i < len; i++) {
    existsChapterIds.push(existsChapter[i].chapterId);
  }

  let newChapter = _.difference(chapterIds, existsChapterIds);

  let row = [];
  for (let i = 0, len = newChapter.length; i < len; i++) {
    let chapter = chapterObj[newChapter[i]];
    let content = '';
    try {
      content = yield getArticleContent(chapter.chapterId);
    } catch (err) {
      console.log('---get err: ', err);
    }

    if (content == '') {
      chapterInfo.push(chapter);
      continue;
    }

    row.push({
      chapterId: chapter.chapterId,
      chapterTitle: chapter.chapterTitle,
      content: content
    });
    if (row.length >= 10) {
      try {
        yield model.mysql.novel.chapter.bulkCreate(row);
        row = [];
        console.log('----bulk create done');
      } catch (err) {
        console.log('---bulk create content error: ', err)
      }
    }
  }
  if (row.length) {
    try {
      yield model.mysql.novel.chapter.bulkCreate(row);
      row = [];
    } catch (err) {
      console.log('---bulk create content error: ', err)
    }
  }

  console.log('----workUpdateArticle done');
};

let workUpdateChapterList = function* (bookId) {
  let chapterList = yield getChapterList(bookId);
  if (chapterList.length) {
    let chapterIdSet = new Set();
    let chapterObj = {};
    for (let i = 0, len = chapterList.length; i < len; i++) {
      chapterIdSet.add(chapterList[i].chapterId);
      chapterObj[chapterList[i].chapterId] = chapterList[i];
    }
    let chapterIds = Array.from(chapterIdSet);
    //get exists chapter info
    let existsChapter = yield model.mysql.novel.director.findAll({
      where: {
        chapterId: {$in: chapterIds}
      }
    });

    let existsChapterIds = [];
    for (let i = 0, len = existsChapter.length; i < len; i++) {
      existsChapterIds.push(existsChapter[i].chapterId);
    }

    let newChapterIds = _.difference(chapterIds, existsChapterIds);
    let newChapters = [];
    for (let i = 0, len = newChapterIds.length; i < len; i++) {
      newChapters.push(chapterObj[newChapterIds[i]]);
    }
    yield model.mysql.novel.director.bulkCreate(newChapters);
  }

  console.log('------workUpdateChapterList done');
};

let getTagUpdateList = function* (uri, tag) {
  let data;
  let chapterIds = [];
  let result = [];
  try {
    data = yield thunkify(request)({
      uri: uri,
      method: 'get',
      timeout: 1000 * 60
    });
  } catch (err) {
    console.log('----pull internet page updates failed error: ', err);
    return chapterIds;
  }

  let $ = cheerio.load(data[0].body);
  let list = $('div #main #newscontent .l').children();
  let ul= list['1'].children;
  for (let i = 0, len = ul.length; i < len; i++) {
    if (ul[i].name == 'li') {
      result.push(ul[i].children);
    }
  }
  for (let i = 0, len = result.length; i < len; i++) {
    chapterIds.push(result[i][2].children[0].attribs.href)
  }

  for (let i = 0, len = chapterIds.length; i < len; i++) {
    let chapterId = chapterIds[i];
    let splitLine = chapterIds[i].split('/');
    let bookId = splitLine[1];
    try {
      yield model.mysql.novel.taskPull.findOrCreate({
        where: {
          bookId: bookId,
          chapterId: chapterId,
          tag: tag
        },
        defaults: {
          bookId: bookId,
          chapterId: chapterId,
          tag: tag,
          status: 'pending'
        }
      });
    } catch (error) {
      console.log('---create new task error: ', error);
    }
  }
  console.log('-=-=-=--=-=-getTagUpdateList done');
};

let work = function* () {
  for (let i = 0, len = pages.length; i < len; i++) {
    yield getTagUpdateList(pages[i].uri, pages[i].tag);
  }

  console.log('-=-=-=-=-work done： ', new Date());
  setTimeout(function(){
    co(work()).then(function(){}, function(err) {
      console.log('---work3 error---: ', err);
      process.exit(0);
    });
  }, 60000 * 10);
};

let workUpdateBook = function* () {
  let task = yield model.mysql.novel.taskPull.findOne({
    where: {
      status: 'pending'
    }
  });

  if (task && task.bookId) {
    // update task status to running
    try {
      yield model.mysql.novel.taskPull.update({
        status: 'running',
        bookId: task.bookId,
        chapterId: task.chapterId,
        tag: task.tag,
        updatedAt: new Date()
      }, {
        where: {
          id: task.id
        }
      });
    } catch (error) {
      console.log('--update task status to running error: ', error);
    }
    // create a new book item if not exists
    yield model.mysql.novel.book.findOrCreate({
      where: {
        bookId: task.bookId,
        tag: task.tag
      },
      default: {
        bookId: task.bookId,
        tag: task.tag
      }
    });

    yield workUpdateChapterList(task.bookId);
    yield workUpdateArticle(task.bookId);

    try {
      yield model.mysql.novel.taskPull.update({
        status: 'success',
        bookId: task.bookId,
        chapterId: task.chapterId,
        tag: task.tag,
        updatedAt: new Date()
      },{
        where: {
          id: task.id
        }
      });
    } catch (err) {
      console.log('---update task pull error: ', err);
    }
  }
  console.log('----workUpdateBook done');

  setTimeout(function() {
    co(workUpdateBook()).then(function(){}, function(err) {
      if (err) {
        console.log(err);
        process.exit(0);
      }
    });
  }, 0);
};

co(work()).then(function(){
  co(workUpdateBook()).then(function() {}, function(err) {
    if (err) {
      console.log(err);
      process.exit(0);
    }
  });
}, function(err) {
  if(err){
    console.log(err);
    process.exit(0);
  }
});