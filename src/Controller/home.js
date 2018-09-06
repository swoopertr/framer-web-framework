var render = require('./../Middleware/render');
var header = require('./../Middleware/header');
var session = require('./../Middleware/session');
var view = require('./../Middleware/ViewPack');

var home = {
  main: function (req, res) {
    header.addHeader(res, {key:'X-power-up',value: 'theking'}, function (resp) {
      var sessionInfo = session.get(req,resp);
      console.log(sessionInfo);
      session.set(req, resp,'user',444, function (reqs, resps) {
          var sessObj = session.get(reqs, resps);
          console.log(sessObj);
          render.renderData(resps, {data: 'hello'}, 'json');
      });
    });
  }
};
module.exports = home;