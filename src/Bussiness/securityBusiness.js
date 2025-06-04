//const pgUser  = require("../Data/pg/user");
const render = require("../Middleware/render");
let work = {
    checkToken : function(req, res, securityArray , cb){
        let token = req.headers.token;
        let email = req.headers.email;
        if(token === undefined || email === undefined){
            render.renderFail(res, 401, 'user is not authorized');
            return;
        }
        pgUser.checkTokenCallback(token, email, function(err, userData){
            if(err){
                render.renderFail(res, 401, 'user is not authorized');
                return;
            }

            if(userData.length === 0){
                render.renderFail(res, 401, 'user is not authorized');
                return;
            }

            let user = userData[0];
            if (securityArray.includes(user.usertype)){
                if (user.tokenexp < new Date()){
                    render.renderFail(res, 401, 'token is expired');
                    return;
                }
                req.user = user;
                cb && cb(req);
                return;
            }
            render.renderFail(res, 401, 'user is not authorized');
            return;
        });
    },
};

module.exports = work;