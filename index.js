let http = require('http');
let setting = require('./src/Config/setting');
let core = require('./src/Core');
let mimeCore = require('./src/Middleware/mimefilter');
let render = require('./src/Middleware/render');
let cluster = require('cluster');
let router = require('./src/route');

let numCPUs = (setting.cpuCount === 0) ? require('os').cpus().length : setting.cpuCount;
console.log(numCPUs);

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    render.init();
    //render.initWatcher();
    router.initRouter(function () {
        http.createServer(function (req, res) {
            core.postHandler(req, res);
            mimeCore.catchMime(req, res);
        }).listen(setting.ServerPort);
        console.log("browse ==> http://localhost:" + setting.ServerPort);
    });
};