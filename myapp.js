
// 加载模块
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var url = require('url');
var _ = require('underscore');
var mountRenderForResponse = require('./guazairender.js')

// 创建服务
var server = http.createServer(function (req, res) {

  // 1. 获取用户请求的路径
  var rUrl = url.parse(req.url.toLowerCase(), true);
  var reqUrl = rUrl.pathname;
  // 获取请求方法
  var method = req.method.toLowerCase();

  // 处理用户请求 /favicon.ico 的问题
  reqUrl = (reqUrl === '/favicon.ico') ? '/resources/images/y18.gif' : reqUrl;

  // 为 res 对象挂载一个 render 函数
  mountRenderForResponse(res);

  // 2. 根据不同请求做出不同处理
  if ((reqUrl === '/' || reqUrl === '/index') && method === 'get') {
    // 返回 `views/index.html` 文件内容
    // render(path.join(__dirname, 'views', 'index.html'), res);
    fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', function (err, data) {
      if (err) {
        throw err
      }
      data = JSON.parse(data);
      res.render(path.join(__dirname, 'views', 'index.html'), { title: 'Hacker News', list: data });
    })


  } else if (reqUrl === '/details' && method === 'get') {
    // 返回 `views/details.html` 文件内容
    // render(path.join(__dirname, 'views', 'details.html'), res);
    fs.readFile(path.join(__dirname, 'data', 'data.json'), "utf8", function (err, data) {
      if (err) {
        throw err
      }
      data=JSON.parse(data);
      for(var i=0;i<data.length;i++){
        if(data[i]['id']==rUrl.query['id']){
          var list=[data[i]];
          break;
        }
      }
      res.render(path.join(__dirname, 'views', 'details.html'),{title:'Hacker News',list:list,});

    })

  } else if (reqUrl === '/submit' && method === 'get') {
    // 返回 `views/submit.html` 文件内容
    // render(path.join(__dirname, 'views', 'submit.html'), res);

    res.render(path.join(__dirname, 'views', 'submit.html'));

  } else if (reqUrl === '/r' && method === 'get') {
    // 表示通过 get 请求来提交数据
    // 获取用户通过 get 方式提交过来的数据, 并且把这些数据保存到一个 json文件中
    // console.log(rUrl.query);
    fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', function (err, data) {
      var list;
      if (data) {
        list = JSON.parse(data);
      } else {
        list = [];
      }
      list.unshift(rUrl.query);
      fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(list), function (err, data) {
        res.writeHead(301, 'Moved Permanently', {
          'location': '/index'
        })
        res.end();
      });
    })
  } else if (reqUrl === '/r' && method === 'post') {
    // 表示通过 post 请求来提交数据
    // 获取用户通过 post 方式提交过来的数据, 并且把这些数据保存到一个 json文件中
    fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', function (err, data) {
      var list;
      if (data) {
        list = JSON.parse(data);
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
        fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(list), function (err, data) {
          res.writeHead(301, 'Moved Permanently', {
            'location': '/index'
          })
          res.end();
        });
      })

    })

  } else if (reqUrl.startsWith('/resources')) {

    // 如果请求的是以 /resources 开头, 那么就把这个请求当做静态资源来处理
    res.render(path.join(__dirname, reqUrl));
  }

  // else {
  //   // 都认为是请求不存在的页面
  //   res.statusCode = 404;
  //   res.
  // }



});

// 开启服务
server.listen(9090, function () {
  console.log('http://localhost:9090');
});

