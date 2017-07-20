var fs = require('fs');
var path = require('path');
var context = require('./context.js');
var getPath = require('./data.js')
module.exports = {
    //首页
    index: function (req, res) {
        context.readFile(function (data) {
            res.render(path.join(getPath.viewsPath, 'index.html'), { title: 'Hacker News', list: data });
        })
    },
    //详情页
    details: function (req, res) {
        context.readFile(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i]['id'] == res.rUrl.query['id']) {
                    var list = [data[i]];
                    break;
                }
            }
            res.render(path.join(getPath.viewsPath, 'details.html'), { title: 'Hacker News', list: list, });
        })

    },
    //提交页面
    submit: function (req, res) {
        res.render(path.join(getPath.viewsPath, 'submit.html'));
    },
    addGet: function (req, res) {
        context.readFile(function (data) {
            var list;
            if (data) {
                list = data;
            } else {
                list = [];
            }
            list.unshift(res.rUrl.query);
            fs.writeFile(getPath.dataPath, JSON.stringify(list), function (err, data) {
                res.writeHead(301, 'Moved Permanently', {
                    'location': '/index'
                })
                res.end();
            });
        })

    },
    addPost: function (req, res) {
        context.readFile(function (data) {
            res.data = data;
            context.handleInfo(req, res, function (list) {
                res.list = list;
                context.writeFile(req, res);
            });
        })
    },
    staticInfo: function (req, res) {
        res.render(path.join(__dirname, res.rUrl.pathname));
    },
    notFound: function (req, res) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html;charset=utf8');
        res.end('NOT FOUND 找不到')
    }
}