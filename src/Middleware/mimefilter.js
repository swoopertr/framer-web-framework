let setting = require('./../Config/setting');
let defaults = require('./../Config/Defaults/Default');
let core = require('./../Core');
let route = require('./../route');
let header = require('./header');

function setHeaderAndServeContent(res, headerType, filePath) {
    res.writeHead(200, headerType);
    core.getfileContent(res, filePath);
}

function setHeaderAndServeImg(res, headerType, filePath) {
    res.writeHead(200, headerType);
    core.getfileContentImg(res, filePath);
}

let mimeRequest = {

    catchMime: function (req, res) {
        if (req.url === '/favicon.ico') {
            res.writeHead(200, { 'Content-Type': 'image/x-icon' });
            res.end();
            return false;
        }

        if (!core.checkVirtual(req.url)) {

            var filePath = req.url.replace(setting.virtualRootPath, setting.rootPath);
            var ext = core.getExtention(req.url);

            switch (ext) {
                case '.css':
                    setHeaderAndServeContent(res, defaults.TheHeaderCss, filePath);
                    break;
                case '.js':
                    setHeaderAndServeContent(res, defaults.TheHeaderJavascript, filePath);
                    break;
                case '.png':
                    setHeaderAndServeImg(res, defaults.TheHeaderPNG, filePath);
                    break;
                case '.jpeg':
                    setHeaderAndServeImg(res, defaults.TheHeaderPNG, filePath);
                    break;
                case '.jpg':
                    setHeaderAndServeImg(res, defaults.TheHeaderJPG, filePath);
                    break;
                case '.html':
                    setHeaderAndServeImg(res, defaults.TheHeaderHtml, filePath);
                    break;
            }
            //return;
        } else {
            //adding general header.
            /* header.addHeader(res,{key: 'sacma-header',value: 'sacmeValue'}, function (resp) {
                 route.routePath(req, resp);
             });*/

            /*var ip = core.getCallerIP(req);
            //if (rateLimiter.check(ip)) {
              route.routePath(req, res);
            } else {
              render.renderFail(res, 429, 'http 429 too many request', '');
            }*/
            route.routePath(req, res);
        }

    }

};

module.exports = mimeRequest;