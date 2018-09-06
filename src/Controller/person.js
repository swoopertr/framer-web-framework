var personManager= require('./../Data/person');
var render = require('./../Middleware/render');
var cache= require('./../Middleware/cacheFrame');
var cookie = require('./../Middleware/cookie');
var view = require('./../Middleware/ViewPack');

var person= {
  list:function (req, res) {
    personManager.getlist(function (data) {
      var mata = {
        data: data,
        kata:123
      };
      cookie.setCookie(req,res,'trytocook',1,function (reqp,resp) {
        render.renderFull(resp, view.views["person"]["list"] , mata);
      });
    });
  },
  index:function (req, res) {
    var data = {
      name:"john",
      email:"aa@a.com"
    };
    render.renderFull(res, view.views["person"]["index"], data);
  }
};
module.exports = person;