var core = require('./../Core');
var render = require('./../Middleware/render');
var errorController ={
  error404:function (req, res) {
    render.renderHtml(res, "error - 404", "error404");
    return;
  },
  error500:function (req, res) {
    render.renderHtml(res, "error - 500", "error500");
    return;
  }

};

module.exports = errorController;