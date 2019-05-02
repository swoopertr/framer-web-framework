var http = require('http');
var setting = require('./src/Config/setting');
var core = require('./src/Core');
var mimeCore = require('./src/Middleware/mimefilter');
var render = require('./src/Middleware/render');
var cluster = require('cluster');

var numCPUs = (setting.cpuCount === 0) ? require('os').cpus().length : setting.cpuCount;
console.log(numCPUs);

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    render.init();
    render.initWatcher();
    core.initRouter(function () {
        http.createServer(function (req, res) {
            mimeCore.catchMime(req, res);
        }).listen(setting.ServerPort);
        console.log("browse ==> http://localhost:" + setting.ServerPort);
    });
};