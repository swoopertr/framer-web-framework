var render = require('./../Middleware/render');
var header = require('./../Middleware/header');
var session = require('./../Middleware/session');
var view = require('./../Middleware/ViewPack');

var home = {
    main: function (req, res) {
        render.renderData(res, {data: 'hello'}, 'json');
    },
    ana: function (req, res) {
        var data = {thedata: 'ana datası'};
        render.renderHtml(res, view.views["home"]["main"], data);
    }
};
module.exports = home;