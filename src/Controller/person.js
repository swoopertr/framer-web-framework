var personManager = require('./../Data/person'),
    render = require('./../Middleware/render'),
    view = require('./../Middleware/ViewPack');

var person = {
    list: function (req, res) {
        personManager.getlist(function (data) {
            var data = {
                data: JSON.stringify(data),
                kata: 123
            };
            render.renderHtml(res, view.views["person"]["list"], data);
        });
    },
    create: function(req, res){
        personManager.create();
    },
    index: function (req, res) {
        let data = {
            name: "john",
            email: "aa@a.com"
        };
        render.renderData(res, data);
    }
};
module.exports = person;