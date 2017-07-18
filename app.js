var http = require('http');
var router = require('./router.js');
var mountRenderForResponse = require('./context.js');
var server = http.createServer(function (req, res) {
    mountRenderForResponse.setRander(req, res);
    mountRenderForResponse.handleReqInfo(req, res);
    router(req, res);

})
server.listen(9090, function () {
    console.log('http://localhost:9090');
});