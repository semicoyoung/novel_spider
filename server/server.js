'use strict';

let express = require('express');
let request = require('request');
let co = require('co');
let thunkify = require('thunkify-wrap');
let cheerio = require('cheerio');
let app = express();

app.use(require('compression')());
app.use(require('connect-timeout')(60 * 1000, {respond: false}));

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('cookie-parser')());

app.get('/', function(req, res, next){
 co(function*(){
    let data = yield thunkify(request)({
      uri: 'http://www.biquge.com/35_35137/2592168.html',
      method: 'get'
    });
   let $ = cheerio.load(data[0].body);
   let contents = $('div .content_read .box_con #content').text();
   return contents;
  }).then(function(data){
    res.send(data);
  })
})

process.on('uncaughtException', function (err) {
    console.error('Global:');
    console.error(err);
    process.exit(0);
  });

let port = 3000;
app.listen(port);
console.log('server start up on port: ',port);
