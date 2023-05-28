var render = require('./../Middleware/render');
var header = require('./../Middleware/header');
var session = require('./../Middleware/session');
var view = require('./../Middleware/ViewPack');
var ramApi = require('./../Data/External/RickAndMorty');

var home = {
    main: function (req, res) {
        render.renderData(res, {data: 'hello'}, 'json');
    },
    RickAndMortyPage: function (req, res) {
        ramApi.getNames(function (result) {
            var data = {
                data: result
            };
            render.renderHtml(res, view.views["home"]["main"], data);
        });
    },
    main_login : function (req, res) {
        //get loginurl

        //Getting the user from Google with the code


        //Getting the current user
    }
};
module.exports = home;



