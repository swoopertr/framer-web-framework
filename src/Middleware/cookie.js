var header = require('./header');
//todo re-organize the cookies.
var toStringify = function (cookieObj) {
    var list = [];
    for (var key in cookieObj) {
        list.push(key + '=' + encodeURI(cookieObj[key]));
    }
    return list.join('; ');
};

var list = function (req, res) {
    var cookieObj = {};
    var fullList = req.headers.cookie;
    if (fullList) {
        var cookieArray = fullList.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            var parts = cookieArray[i].split("=");
            if (cookieArray[i] === "") {
                continue;
            }
            cookieObj[parts[0].trim()] = decodeURI(parts[1].trim());
        }
    }
    return cookieObj;
};

var get = function (req, res, key) {
    var result = undefined;
    var fullList = req.headers.cookie;
    if (fullList) {
        var cookieArray = fullList.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            var parts = cookieArray[i].split("=");
            if (key === parts[0].trim()) {
                result = decodeURI(parts[1].trim());
                break;
            }
        }
    }
    return result;
};

var set = function (req, res, key, value, cb) {
    var cookieObj = list(req, res);
    cookieObj[key] = value;
    header.addHeader(res, {key: 'Set-Cookie', value: toStringify(cookieObj)}, function (resm) {
        var cookieText = toStringify(cookieObj);
        req.headers.cookie = cookieText;

        cb && cb(req, resm);

    });
};

var remove = function (req, res, key, cb) {
    var cookieObj = list(req, res);
    delete cookieObj[key];
    var cookieText = toStringify(cookieObj);
    req.headers.cookie = cookieText;
    set(req, res, 'Set-Cookie', cookieText, function (reqm, resm) {
        cb(reqm, resm);
    });
};

var cookie = {
    getCookieList: list,
    getCookie: get,
    setCookie: set,
    removeCookie: remove
};

module.exports = cookie;