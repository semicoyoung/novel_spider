'use strict';


let express = require('express');
let request = require('request');
let co = require('co');
let thunkify = require('thunkify-wrap');
let cheerio = require('cheerio');
let app = express();
let log = require('util').log;
app.use(require('compression')());
app.use(require('connect-timeout')(600 * 1000, {respond: false}));

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('cookie-parser')());

let baseUrl = 'http://www.biquge.com';

app.get('/', function(req, res, next){
log(req.method, req.url);
 co(function*(){
   let data = yield getChapterList('43_43821');
   return data;
   //
   // let content = yield getArticleContent('/43_43821/2692828.html');
   // return content;
  }).then(function(data){
    res.send(data);
  })
});

process.on('uncaughtException', function (err) {
    console.error('Global:');
    console.error(err);
    process.exit(0);
  });

let port = 3000;
app.listen(port);
console.log('server start up on port: ',port);

// 获取书的目录页的数据：书的目录
let getChapterList = function* (bookId) {
  let uri = baseUrl + '/' + bookId;
  let data = yield thunkify(request)({
    uri: uri,
    method: 'get'
  });

  let $ = cheerio.load(data[0].body);
  let inner = $('div .box_con #list')['0'].children[1].children;
  let chapters = [];
  for (let i = 0, len = inner.length; i < len; i++) {
    if (inner[i].type && inner[i].type == 'tag' && inner[i].name  && inner[i].name == 'dd') {
      chapters.push({
        id: inner[i].children[1].attribs.href,
        title: inner[i].children[1].children[0].data
      });
    }
  }

  return chapters;
};

// 获取书的某一章的页面的数据： 书的某一章的内容
let getArticleContent = function* (articleId) {
  let uri = baseUrl + '/' + articleId;
  let data = yield thunkify(request)({
    uri: uri,
    method: 'get'
  });

  let $ = cheerio.load(data[0].body);

  let contents = $('div .content_read .box_con #content').text();
  return contents;
}
