let http = require("node:http");
let setting = require("./src/Config/setting");
let core = require("./src/Core");
let mimeCore = require("./src/Middleware/mimefilter");
let render = require("./src/Middleware/render");
let cluster = require("cluster");
let router = require("./src/route");

let numCPUs =
  setting.cpuCount === 0 ? require("os").cpus().length : setting.cpuCount;
console.log(numCPUs);

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  render.init();
  //render.initWatcher();
  router.initRouter(function () {
    http
      .createServer(async function (req, res) {
        let handler = await core.postHandler(req, res);
        mimeCore.catchMime(handler.req,handler.res);
      })
      .listen(setting.ServerPort);
    console.log("browse ==> http://localhost:" + setting.ServerPort);
  });
}
