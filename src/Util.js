let setting = require('./Config/setting');
let core = require('./Core');
let qs = require('qs');
let jwt = require("jsonwebtoken");

let work = {
    jwt:{
        decode : (token) =>{
            return jwt.decode(token);
        }
    },
    google:{
        getOauthTokens: (code, cb) => {
            //const url = "https://oauth2.googleapis.com/token";
            const values = {
                code,
                client_id : setting.google.client_id,
                client_secret: setting.google.client_secret,
                redirect_uri : setting.google.redirect_uris[0],
                grant_type :'authorization_code'
            };

            try {
                let header = {"Content-Type": "application/x-www-form-urlencoded"};
                core.request.post('oauth2.googleapis.com','/token', header, qs.stringify(values), (result)=>{
                    cb && cb(result);
                });
            } catch (error) {
                console.log('error :', error);
            }

        },
        getGoogleAuthUrl :  () => {
            const google_redirectURI= 'auth/redirect/google';
            const rootUrl  = 'https://accounts.google.com/o/oauth2/v2/auth';
            const serverURI = 'http://localhost:8081'
            const options = {
                redirect_uri : `${serverURI}/${google_redirectURI}`,
                client_id : setting.google.client_id,
                access_type : 'offline',
                response_type : "code",
                prompt : "consent",
                scope : [
                    "https://www.googleapis.com/auth/userinfo.profile",
                    "https://www.googleapis.com/auth/userinfo.email",
                  ].join(" "),
            };
            const qs = new URLSearchParams(options);
            return `${rootUrl}?${qs.toString()}`;
        },
        getGoogleUser: (id_token, access_token, cb)=>{
            //let url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
            try {
                let header = {"Authorization": `Bearer ${id_token}`};
                core.request.get("www.googleapis.com", `/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, header, (res)=>{
                    cb && cb(res);
                });
            } catch (error) {
                console.log("Error fetching google user :", error );
                cb && cb(error);
            }
            return;
        }
    }

};

module.exports = work;