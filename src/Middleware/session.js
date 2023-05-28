var cookie = require('./cookie');
var core = require('./../Core');

sessionObj = {};
sessionDefName = 'sessId';
var setSession = function (req, res, key, value, cb, exp ) {
  var sessionId = cookie.getCookie(req, res, sessionDefName);
  if (sessionId === undefined) {
    sessionId = core.guid();
    cookie.setCookie(req, res, sessionDefName, sessionId, function (reqs, ress) {
      sessionObj[sessionId] = {};
      sessionObj[sessionId][key] = value;
      if(typeof exp !== 'undefined'){ //if exp defined
        setTimeout(function () {
          console.log('session silindi ' + sessionId);
          delete sessionObj[sessionId][key];
        },exp);
      }
      if (typeof cb != 'undefined'){
        cb(reqs, ress);
      }
    });
  } else {
    if(sessionObj.hasOwnProperty(sessionId)){
      sessionObj[sessionId][key] = value;
      if (typeof cb != 'undefined') {
        cb(req, res);
      }
    }else {
      sessionObj[sessionId] = {};
      sessionObj[sessionId][key] = value;
      if (typeof exp !== 'undefined') { //if exp defined
        setTimeout(function () {
          console.log('session silindi ' + sessionId);
          delete sessionObj[sessionId][key];
        }, exp);
      }
      if (typeof cb != 'undefined') {
        cb(req, res);
      }
    }
    if(typeof exp !== 'undefined'){ //if exp defined
      setTimeout(function () {
        console.log('session silindi ' + sessionId);
        delete sessionObj[sessionId][key];
      },exp);
    }
  }
};

var removeSession = function (req, key) {
  var sessionId = cookie.getCookie(req,sessionDefName);
  if (sessionId === undefined){
    return;
  }else {
    delete sessionObj[sessionId][key];
  }
};

var clearSession = function (req) {
  var sessionId = cookie.getCookie(req, sessionDefName);
  if (sessionId === undefined){
    return;
  }else {
    delete sessionObj[sessionId];
  }
};

var getSession = function (req, res) {
  var sessionId = cookie.getCookie(req, res, sessionDefName);
  return sessionObj[sessionId];
};

var session = {
  get: getSession,
  set: setSession,
  remove: removeSession,
  clear: clearSession
};

module.exports = session;