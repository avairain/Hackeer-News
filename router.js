
var http = require('http');
var route = require('./routeinfo.js');
module.exports = function (req, res) {
  // 2. 根据不同请求做出不同处理
  if ((res.rUrl.pathname === '/' || res.rUrl.pathname === '/index') &&res.rUrl.method=== 'get') {
    route.index(req, res)
  } else if (res.rUrl.pathname === '/details' &&res.rUrl.method=== 'get') {
    route.details(req, res)
  } else if (res.rUrl.pathname === '/submit' &&res.rUrl.method=== 'get') {
    route.submit(req, res)
  } else if (res.rUrl.pathname === '/r' &&res.rUrl.method=== 'get') {
    route.addGet(req, res)
  } else if (res.rUrl.pathname === '/r' &&res.rUrl.method=== 'post') {
    route.addPost(req, res)
  } else if (res.rUrl.pathname.startsWith('/resources')) {
    route.staticInfo(req, res);
  } else {
    route.notFound(req, res);
  }
};


