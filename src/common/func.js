'use strict';

var Func = function() {};
var that = module.exports = new Func();
let request = require('request');

// 将下划线命名转换为驼峰命名
_.toCamel = function (name) {
  var newName = '';
  var underline = false;
  for (var i = 0; i < name.length; i++) {
    if (name[i] === '_' || name[i] === '-') {
      underline = true;
    } else {
      newName += underline ? name[i].toUpperCase() : name[i];
      underline = false;
    }
  }
  ;
  return newName;
};

// 获取IP地址
Func.getIp = function(req) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

  if (ip.match(/\d+\.\d+\.\d+\.\d+/)) {
    ip = ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
  } else {
    ip = '0.0.0.0';
  }

  return ip;
};

Func.prototype.hash = function(raw, type) {
  type = type || 'md5';
  return crypto.createHash(type).update(raw).digest('hex');
};

let mapHmId2Name = function* (lines, type) {
  if (!lines.length) {
    return {};
  }

  let idSet = new Set();
  for (let i = 0, l = lines.length; i < l; ++i) {
    idSet.add(parseInt(lines[i][type]) || 0 );
  }

  let ids = Array.from(idSet);

  try {
    var ret = yield thunkify(request)({
      uri: constant.API.RES_MANAGER + '/' + type,
      method: 'get',
      qs: {ids: JSON.stringify(ids), pageSize: ids.length}
    });
    ret = JSON.parse(ret[1]);
  } catch (e) {
    console.log(e);
    throw new Exception(1004);
  }

  if (parseInt(ret.code) !== 0 || ret.data === undefined) {
    console.log('err return from data_rw');
    throw new Exception();
  }

  let hmResult = {};
  if (ret.data.rows && ret.data.rows instanceof Array) {
    ret.data.rows.forEach(function (hm) {
      hmResult[hm.id] = hm.name;
    });
  }
  return hmResult;
};

Func.prototype.joinCollections = function (first, secondArray, joinKey) {
  if (!secondArray.length) {
    return false;
  }

  // map the 2nd array
  let secondObj = {};
  for (let i = secondArray.length; i--; ) {
    if (secondArray[i][joinKey]) {
      secondObj[secondArray[i][joinKey]] = secondArray[i];
    }
  }

  if (first instanceof Array) {
    // join with the 1st array
    for (let i = first.length; i--; ) {
      if (secondObj[first[i][joinKey]]) {
        _.assign(first[i], secondObj[first[i][joinKey]]);
      }
    }
  } else if (first instanceof Object) {
    // join with the 1st object
    for (let key in first) {
      if (secondObj[first[key][joinKey]]) {
        _.assign(first[key], secondObj[first[key][joinKey]]);
      }
    }
  }
};

Date.prototype.format = function (fmt) { //author: meizz 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};
