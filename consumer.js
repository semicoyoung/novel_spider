'use strict';

require('./src/common/global');

let baseUrl = config.baseUrl;
let createAuthor = function* (authorName) {
  let author = null;
  try {
    author = yield model.mysql.novel.author.findOrCreate({
      where: {
        authorName: authorName
      }
    });
  } catch (error) {
    console.log('---find or create author arror');
  }
  if (author && author.length && author[0].id) {
    return author[0].id;
  }
  return null;
};

let getBookIntroduction = function* (bookId) {
  let uri = baseUrl + '/' + bookId;
  let chapters = [];
  let data;
  try {
    data = yield thunkify(request)({
      uri: uri,
      method: 'get'
    });
  } catch (err) {
    console.log('get chapter list error: ');
    return chapters;
  }

  let $ = cheerio.load(data[0].body);
  let intro = $('div .box_con #maininfo #intro')[0].children;
  let image = $('div .box_con #sidebar #fmimg img')[0].attribs;

  let introduction = [];
  for (let i = 0, len = intro.length; i < len; i++) {
    if (intro[i].type && intro[i].type == 'text') {
      introduction.push(intro[i].data);
    }
  }
  return {
    image: image,
    introduction: introduction,
  }
};

let createBook = function* (book) {
  let authorId = yield createAuthor(book.authorName);
  let bookIntro = yield getBookIntroduction(book.bookId);
  try {
    yield model.mysql.novel.book.findOrCreate({
      where: {
        bookId: book.bookId,
        tag: book.tag,
      },defaults: {
        bookId: book.bookId,
        bookName: book.bookName,
        chapterId: book.chapterId,
        chapterTitle: book.chapterTitle,
        tag: book.tag,
        authorId: authorId || '',
        bookIntroduction: JSON.stringify(bookIntro.introduction),
        bookImageUrl: JSON.stringify(bookIntro.image),
      }
    })
  } catch (error) {
    console.log('---create book error: ');
  }
};

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
    console.log('get chapter list error: ');
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

  //console.log('----getChapterList done');

  return chapters;
};

let updateDirector = function* (bookId) {
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

};

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
    console.log('---error: ');
    return '';
  }

  let $ = cheerio.load(data[0].body);

  let contents = $('div .content_read .box_con #content').text();
 // console.log('-----getArticleContent');
  return contents;
}

let createContent = function* (bookId) {
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
      console.log('---get err: ');
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
        console.log('---bulk create content error: ')
      }
    }
  }
  if (row.length) {
    try {
      yield model.mysql.novel.chapter.bulkCreate(row);
      row = [];
    } catch (err) {
      console.log('---bulk create content error: ')
    }
  }
};

let work = function* () {
  let task = yield model.mysql.novel.taskPull.findOne({
    where: {
      status: 'pending',
    }
  });

  if (task && task.bookId) {
    // update task status to running
    try {
      yield model.mysql.novel.taskPull.update({
        status: 'running',
        bookId: task.bookId,
        bookName: task.bookName,
        chapterId: task.chapterId,
        chapterTitle: task.chapterTitle,
        tag: task.tag,
        authorName: task.authorName,
        updatedAt: new Date()
      }, {
        where: {
          id: task.id
        }
      });
    } catch (error) {
      console.log('--update task status error: ')
    }


    // update create book
    yield createBook({
      bookId: task.bookId,
      bookName: task.bookName,
      chapterId: task.chapterId,
      chapterTitle: task.chapterTitle,
      tag: task.tag,
      authorName: task.authorName,
    });

    //update director
    yield updateDirector(task.bookId);
    //create content
    yield createContent(task.bookId);

    // update task status to success
    try {
      yield model.mysql.novel.taskPull.update({
        status: 'success',
        bookId: task.bookId,
        bookName: task.bookName,
        chapterId: task.chapterId,
        chapterTitle: task.chapterTitle,
        tag: task.tag,
        authorName: task.authorName,
        updatedAt: new Date()
      }, {
        where: {
          id: task.id
        }
      });
    } catch (error) {
      console.log('--update task status error: ')
    }
  }
  setTimeout(function () {
    co(wock()).then(function () {}, function (err) {
      if (err) {
        console.log(err);
        process.exit(0);       
      }
    })
  },0);
};

co(work()).then(function () {}, function (err) {
  if (err) {
    console.log(err);
    process.exit(0);
  }
});
