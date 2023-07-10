let core = require('./../Core');
let render = require('./../Middleware/render');
let header = require('./../Middleware/header');
let session = require('./../Middleware/session');
let view = require('./../Middleware/ViewPack');
let ramApi = require('./../Data/External/RickAndMorty');
let url = require('url');
let util = require('./../Util');
const { readSync } = require('fs');

let home = {
    main: function (req, res) {
        render.renderData(res, {data: 'hello'}, 'json');
    },
    RickAndMortyPage: function (req, res) {
        ramApi.getNames(function (result) {
            let data = {
                data: result
            };
            render.renderHtml(res, view.views["home"]["main"], data);
        });
    },
    google_auth_login : function (req, res) {
        //getting loginurl
        let uri = util.google.getGoogleAuthUrl();
        //redirect to googles page
        core.redirect(res, uri);
        return;
        //render.renderData(res, core.getGoogleAuthUrl());
        //Getting the user from Google with the code


        //Getting the current user
    },
    google_auth_redirect : function(req, res){
        let obj = url.parse(req.url, true).query;
        const code = obj.code; 
        try {
            util.google.getOauthTokens(code, (result)=>{
                console.info(result);
                let pay_load = util.jwt.decode(result.id_token);
                console.log("google_user in jwt: ", pay_load);
                util.google.getGoogleUser(result.id_token, result.access_token, (ret_val)=>{
                    console.log("google_user with google api: ", pay_load);
                    render.renderData(res, ret_val);
                });
            });    
        } catch (error) {
            render.renderData(res, error);
        }
        return;
    }
};
module.exports = home;



