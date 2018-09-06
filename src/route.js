var setting = require('./Config/setting');

function RouteGuider(req, res) {
  var routePath = req.url.split('?')[0];
  var verbName = req.method.toLowerCase();

  if(routePath[0] ==="/" ){
    routePath = routePath.substring(1);
  }
  if (routePath == "") {
    routePath = "home";
  }

  if (global.routes.hasOwnProperty(routePath)) {
    var item = global.routes[routePath][verbName];
    var resolver;
    try{
      resolver= require.resolve(setting.controllerFolder + item.controller);
    }
    catch (err){
      console.log("Cant resolve module :"+ setting.controllerFolder + item.controller);
      var controller = require(setting.errorController);
      controller.error404(req, res);
      return false;
    }

    var controller = require(setting.controllerFolder + item.controller);
    controller[item.function](req, res);
  } else {
    var controller = require(setting.errorController);
    controller.error404(req, res);
  }
}

module.exports = {
  guideRequest:RouteGuider
};