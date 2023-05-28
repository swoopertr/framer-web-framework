var setting = require('./../Config/setting');
var defaults = require('./../Config/Defaults/Default');
var core  = require('./../Core');
var route = require('./../route');
var header = require('./header');

var mimeRequest = {

  catchMime: function (req, res) {
    if (req.url === '/favicon.ico') {
      res.writeHead(200, {'Content-Type': 'image/x-icon'});
      res.end();
      return false;
    }
    core.checkVirtual(req.url, function (isVirtual) {
      if (isVirtual){
        var filePath = req.url.replace(setting.virtualRootPath, setting.rootPath);
        var ext = core.getExtention(req.url);

        switch (ext){
          case '.css':
            res.writeHead(200, defaults.TheHeaderCss);
            core.getfileContent(res, filePath);
            break;
          case '.js':
            res.writeHead(200, defaults.TheHeaderJavascript);
            core.getfileContent(res, filePath);
            break;
          case '.png':
            res.writeHead(200, defaults.TheHeaderPNG);
            core.getfileContentImg(res, filePath);
            break;
          case '.jpeg':
            res.writeHead(200, defaults.TheHeaderJPEG);
            core.getfileContentImg(res, filePath);
            break;
          case '.jpg':
            res.writeHead(200, defaults.TheHeaderJPG);
            core.getfileContentImg(res, filePath);
            break;
          case '.html':
            res.writeHead(200, defaults.TheHeaderHtml);
            core.getfileContentImg(res, filePath);
            break;
        }
      }else {
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
    });
  }

};

module.exports= mimeRequest;