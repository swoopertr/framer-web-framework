let dir = process.cwd();
let fs = require('fs');
let Router = require('@medley/router');
let setting = require('./Config/setting');
let render = require('./Middleware/render');
let core = require('./Core');
let router = new Router();
let security = require('./Bussiness/securityBusiness');

let loadRouteFile = function () {
    fs.readFile(dir + setting.jsonPath, 'utf-8', async function (err, content) {
        let routes = JSON.parse(content);
        
        await registerRoutes(routes);
        global.routes ={};
        for (let i = 0; i < routes.length; i++) {
            const item = routes[i];
            if(global.routes.hasOwnProperty(item.path)){
                console.log('Route already exists: ', item.path);
                throw new Error('Route already exists: ' + item.path);
            }else{
                global.routes[item.path] = item;
            }
        }
    });
};

var registerRoutes = async function (routes) {
    for (let i = 0; i < routes.length; i++) {
        const item = routes[i];
        const controller = require(setting.controllerFolder + item.controller);
        const fn = controller[item.function];
        console.log("registering : ", item.path);
        addRoute(item.method, item.path, fn, item.security);
        await core.sleep(100);
    }
};

let addRoute = function (method, path, handler, security) {
    let store = router.register(path);
    store[method] = handler;
    if (security) {
        store.security = security;
    }
};

function routePath(req, res) {
    let handler = router.find(req.url);
    if (handler == undefined) {
        render.renderData(res, 'This URL is not exist!', 'text');
        return;
    }

    req.params = handler.params;
    if (handler.store.security) {
        security.checkToken(req, res, handler.store.security.usertype, function (reqp) {
            handler.store[req.method.toLowerCase()](reqp, res);
        });
    }else{
        handler.store[req.method.toLowerCase()](req, res);
    }
    
    
}

module.exports = {
    routePath,
    initRouter: cb => {
        core.emitter_definitions();
        loadRouteFile();
        core.defineFriendlyDate();
        core.defineTokenValidation();
        core.defineEmailValidation();
        cb && cb();
    },
};
