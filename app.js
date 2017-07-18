var http = require('http');
var router = require('./router.js');
var data = require('./data.js')
var mountRenderForResponse = require('./context.js');
var server = http.createServer(function (req, res) {
    mountRenderForResponse.setRander(req, res);
    mountRenderForResponse.handleReqInfo(req, res);
    router(req, res);

})
server.listen(data.port, function () {
    console.log('http://localhost:'+data.port);
});