'use strict';

require('./src/common/global');

let createTask = function* (url, tag) {
  let data;
  try {
    data = yield thunkify(request)({
      uri: url,
      method: 'get',
      timeout: 1000 * 60
    });
  } catch (err) {
    console.log('----pull internet page updates failed error: ', err);
  }

  let $ = cheerio.load(data[0].body);
  let list = $('div #main #newscontent .l ul')[0].children;
  let row = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i].name && list[i].name == 'li') {
      //todo: redis 进行缓存,之后新建任务可以用 bulkcreate 进行批量创建
      let bookId = (list[i].children[1].children[0].attribs.href).split('/')[1];
      let chapterId = list[i].children[2].children[0].attribs.href;

      let cacheResult = yield redis.get(bookId);
      if (cacheResult && cacheResult == chapterId) {
        continue;
      } else if (!cacheResult || cacheResult != chapterId) {
        yield redis.set(bookId, chapterId, 'EX', 86400);
        row.push({
          tag: tag,
          bookId: (list[i].children[1].children[0].attribs.href).split('/')[1],
          bookName: list[i].children[1].children[0].children[0].data,
          chapterId: list[i].children[2].children[0].attribs.href,
          chapterTitle: list[i].children[2].children[0].children[0].data,
          authorName: list[i].children[3].children[0].data,
          status: 'pending',
        });
        if (row && row.length >= 10) {
          try {
            yield model.mysql.novel.taskPull.bulkCreate(row);
          } catch (err) {
            console.log('---task bulk create error');
          }
          row = [];
        }
      }
    }
  }
  if (row && row.length > 0) {
    try {
      yield model.mysql.novel.taskPull.bulkCreate(row);
    } catch (err) {
      console.log('---task bulk create error');
    }
  }
};

let work = function* () {
  for (let i = 0,len = config.pages.length; i < len; i++) {
    yield createTask(config.pages[i].url, config.pages[i].tag);
  }

  setTimeout(function() {
    co(work()).then(function () {}, function (err) {
      if (err) {
        console.log('----producer error: ', err);
        process.exit(0);
      }
    },3000);
  })
};

co(work()).then(function () {}, function (err) {
  if (err) {
    console.log('----producer error: ',err);
    process.exit(0);
  }
})
