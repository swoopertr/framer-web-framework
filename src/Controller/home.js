let core = require('./../Core');
let render = require('./../Middleware/render');
let header = require('./../Middleware/header');
let session = require('./../Middleware/session');
let view = require('./../Middleware/ViewPack');
let ramApi = require('./../Data/External/RickAndMorty');
let url = require('url');
let util = require('./../Util');
const { runTerminalCommand } = require('../Helper/command');
const whisperCommandBuilder = require('./../Helper/whisperHelper/whisper');

let home = {
    main: function (req, res) {
        //console.log('page viewed');
        runTerminalCommand('node -v', function (result) {
            render.renderData(res, {data: result}, 'json');
        }, function (error) {
            console.log(error);
        });
    },
    command: function (req, res) {
        
        let formData = req.formData;
        console.log(formData);
        let commandToRun = whisperCommandBuilder.commandBuilder('ggml-large-v3-turbo.bin', 'tr', formData.soundFile, formData.outputFile);
        runTerminalCommand(commandToRun, function (result) {
            
            render.renderData(res, {data: result}, 'json');

        }, 
        function (error) {
            render.renderData(res, {data: error}, 'json');
            console.log(error);
        }
        );
    },
    fileUpload : function (req, res) {
         
        //req.on('end',async function () {
            let formData = req.formData;
            console.log(formData);
            render.renderData(res, {data: formData}, 'json');
       // });
        
        
    },
    RickAndMortyPage: function (req, res) {
        ramApi.getNames(function (result) {
            let data = {
                data: result,
            };
            
            render.renderHtml(res, view.views["home"]["main"], data);
        });
    },
    google_auth_login: function (req, res) {
        //getting loginurl
        let uri = util.google.getGoogleAuthUrl();
        //redirect to googles page
        core.redirect(res, uri);
        return;
        //render.renderData(res, core.getGoogleAuthUrl());
        //Getting the user from Google with the code

        //Getting the current user
    },
    google_auth_redirect: function (req, res) {
        let obj = url.parse(req.url, true).query;
        const code = obj.code;
        try {
            util.google.getOauthTokens(code, result => {
                console.info(result);
                let pay_load = util.jwt.decode(result.id_token);
                console.log('google_user in jwt: ', pay_load);
                util.google.getGoogleUser(result.id_token, result.access_token, ret_val => {
                    console.log('google_user with google api: ', pay_load);
                    render.renderData(res, ret_val);
                });
            });
        } catch (error) {
            render.renderData(res, error);
        }
        return;
    },
};
module.exports = home;
