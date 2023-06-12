let dir = process.cwd();
let fs = require('fs');
let Router = require('@medley/router');
let setting = require('./Config/setting');
let render = require('./Middleware/render');
let core = require('./Core');
let router = new Router();

let loadRouteFile = function () {
    fs.readFile(dir + setting.jsonPath, 'utf-8',async function (err, content) {
        let routes = JSON.parse(content);
        global.routes = routes;
        await registerRoutes();
    });
};

var registerRoutes = async function(){
    for (let i = 0; i < global.routes.length; i++) {
        const item = global.routes[i];
        const controller = require(setting.controllerFolder + item.controller);
        const fn = controller[item.function];
        console.log("resgistering : ", item.path);
        addRoute(item.method, item.path, fn);
        core.sleep(100);
    }
};

let addRoute = function (method, path, handler) {
    let store = router.register(path);
    store[method] = handler;
};

function routePath(req, res){
    let handler = router.find(req.url);
    if(handler == undefined){
        render.renderData(res, 'This URL is not exist!', 'text');
        return;
    }
    let tmp_req = {
        ...req,
        params: handler.params
    };
    handler.store[req.method.toLowerCase()](tmp_req, res);
}

module.exports = {
    routePath,
    initRouter: (cb) => {
        core.emitter_definitions();
        loadRouteFile();
        core.defineFriendlyDate();
        core.defineTokenValidation();
        core.defineEmailValidation();
        cb && cb();
    },
};