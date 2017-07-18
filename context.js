var fs = require('fs');
var _ = require('underscore');
var mime = require('mime');
var path = require('path');
var data = require('./data.js')
var url = require('url');
module.exports.handleReqInfo = function (req, res) {
  // 1. 获取用户请求的路径
  res.rUrl = url.parse(req.url.toLowerCase(), true);
  // 获取请求方法
  res.rUrl.method = req.method.toLowerCase();
  // 处理用户请求 /favicon.ico 的问题
  res.rUrl.pathname = (res.rUrl.pathname === '/favicon.ico') ? '/resources/images/y18.gif' : res.rUrl.pathname;

}
module.exports.setRander =
  function (req, res) {


    res.render = function (filename, tpl) {


      fs.readFile(filename, function (err, data) {
        if (err) {

          if (err.code === 'ENOENT') {
            // 表示请求的文件不存在
            res.statusCode = 404;
            res.statusMessage = 'Not Found';
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            res.end('<h1>404</h1>');
            return;
          }

          throw err;
        }
        if (tpl) {
          data = _.template(data.toString())(tpl)
        }
        // 设置响应报文信息
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.setHeader('Content-Type', mime.lookup(filename));

        // 向浏览器响应内容，并结束响应
        res.end(data);
      });
    };
  }

//处理信息
module.exports.handleInfo = function (req, res, fn) {
  var list;
  if (res.data) {
    list = res.data;
  } else {
    list = [];
  }
  req.on('data', function (data) {
    data = data.toString();
    var arr = data.split("&");
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
      obj[arr[i].split('=')[0]] = arr[i].split('=')[1]
    }
    obj.id = list.length;
    list.unshift(obj);
    req.on('end', function () {
      fn(list);
    })

  })
}


module.exports.readFile = function (fn) {
  fs.readFile(data.dataPath, 'utf8', function (err, data) {
    if (err) {
      throw err
    }
    data = JSON.parse(data || '[]');
    fn(data);
  })
}
module.exports.writeFile = function (req, res) {
  fs.writeFile(data.dataPath, JSON.stringify(res.list), function (err, data) {
    res.writeHead(301, 'Moved Permanently', {
      'location': '/index'
    })
    res.end();
  });

}
