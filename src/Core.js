let fs = require('fs');
let setting = require('./Config/setting');
let dir = process.cwd();
let formidable = require('formidable');
let events = require('events');
let path = require('path');

let GenerateGUID = function () {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

let GenerateToken = function () {
    return 'xxxxxxxxxxxx4xxxxxxyyyyxxxxxxxxxxxxyyyyxyxyxyxyxyx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 35 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(35);
    });
};

let GeneratePassword = function () {
    return Math.random().toString(36).slice(-8);
};

let getFileNames = function (directory, cb) {
    let results = [];
    let dirs = fs.readdirSync(directory);
    for (let i = 0; i < dirs.length; i++) {
        let files = fs.readdirSync(directory + dirs[i]);
        for (let j = 0; j < files.length; j++) {
            let obj = {controller: dirs[i], view: files[j].replace(/\.[^/.]+$/, "")};
            results.push(obj);
        }
    }
    cb && cb(results);
};

let getAllFolderFiles = function(folderName){
    fs.readdirSync(folderName).forEach(File => {
        const Absolute = path.join(folderName, File);
        if (fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
        else return Files.push(Absolute);
    }); 
};

let readFile = function (file, cb) {
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            console.log(err);
        }
        cb && cb(data);
    });
};

let getfileContentImg = function (res, filePath) {
    fs.readFile(dir + filePath, function (err, data) {
        if (err) {
            console.log(err);
        }
        res.end(data);
    });
};

let getfileContent = function (res, filePath) {
    fs.readFile(dir + filePath, function (err, content) {
        if (err) {
            console.log(err);
        }
        res.write(content);
        res.end();
    });
};

let initRouteConfigWatcher = function () {
    fs.watch(dir + setting.jsonPath, function (err, content) {
        if (!global.fsTimeout) {
            global.fsTimeout = setTimeout(function () {
                loadRouteFile();
                console.log('route config reloaded');
                clearTimeout(global.fsTimeout);
                delete global.fsTimeout;
            }, 2000);
        }
    });
};

let loadRouteFile = function () {
    fs.readFile(dir + setting.jsonPath, 'utf-8', function (err, content) {
        let routes = JSON.parse(content);
        global.routes = routes;
    });
};

let callMethods = function (methods, i, cb) {
    if (i === methods.length - 1) {
        methods[i](function () {
            cb && cb();
        });
    } else {
        methods[i](function () {
            callMethods(methods, i + 1, cb);
        });
    }
};

let queryStringToObject = function (search) {
    return  JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) {
        return key === "" ? value : decodeURIComponent(value)
    });
};

let request = {
    get: function (baseUri, path, headers, cb){
        let http = require("https");

        let options = {
            "method": "GET",
            "hostname": baseUri,
            "port": null,
            "path": path
        };
        if (headers){
            options.headers = headers;
        }

        let getReq = http.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                let body = Buffer.concat(chunks);
                let result =JSON.parse(body.toString());
                cb && cb(result);
            });
        });

        getReq.end();
    },
    post: function (baseUri, path, headers, body, cb){

        let http = require("https");
        let options = {
            "method": "POST",
            "hostname": baseUri,
            "path": path,
            "headers": {
                "content-type": "application/json",
            }
        };
        if (headers){
            options.headers = headers;
        }

        let req = http.request(options, function (res) {
            let result = [];

            res.on("data", function (chunk) {
                result.push(chunk);
            });

            res.on("end", function () {
                let result_ = Buffer.concat(result);
                console.log(result_.toString());
                cb && cb(JSON.parse(result_.toString()));
            });
        });

        req.write(body);
        
        req.end();

    },
    getAsync: function (baseUri, path, headers){
        return new Promise((resolve, reject) =>{
            request.get(baseUri,path, headers, function (result){
                resolve(result);
            });
        });
    },
    postAsync: function (baseUri, path, port, headers, body){
        return new Promise(resolve => {
            request.post(baseUri, path, port, headers, body, function (result) {
                resolve(result);
            });
        });
    }
};

let getDictionaryFormData = function (formData, fields, cb) {
    let result = {};
    let hashes = decodeURIComponent(formData.toString());
    let datas = hashes.split('&');
    for (let i = 0; i < datas.length; i++) {
        let itemObj = datas[i].split('=');
        for (let j = 0; j < fields.length; j++) {
            if (fields[j] === itemObj[0]) {
                result[fields[j]] = itemObj[1];
            }
        }
    }
    cb && cb(result);
};

let getActionName = function (actionId) {
    let result = "";
    if (actionId == 1) {
        result = "Insert";
    } else if(actionId == 2){
        result = "Update";
    } else if(actionId == 3){
        result = "Delete";
    }
    return result;
};

let postHandler = function (req, res) {
    if (req.method !== "POST") {
        return;
    }
    let routeName = req.url.split('/');
    let routePath = routeName[1].split('?')[0];
    if (routes.hasOwnProperty(routePath)) {
        let item = routes[routePath];
        if (item.hasOwnProperty('file') && item.file) {

            var cookies = core.parseCookies(req);
            var token = cookies.token;
            const form = formidable({ uploadDir: setting.downloadFolder }); // upload directory

            form.parse(req, (err, fields, files) => {
                if (err) {
                    res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                    res.end(String(err));
                    return;
                }
                req.formData = { fields, files };
                });
            form.on('end', () => {
                console.log('Form upload complete');
                global.events.emit(token + 'form_posted_end');
            });
            return;
        }else{
            req.on('data', function (data) {
                if (req.url)
                    if (!req.formData) {
                        req.formData = Buffer.from(data); //new Buffer(data, 'utf-8');
                    }
            });
            req.on('end', function () {
                let body = req.formData.toString('utf-8');
                body = body.replace(/\+/g, ' ');
                req.formData = JSON.parse(body);
                //console.log(req.formData);
            });
        }
    }

};

let getCallerIP = function(req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    return ip;
}

let defineEmailValidation = function () {
    String.prototype.validateEmail = function () {
        //let mailformat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(this).toLowerCase());
    }
}

let emitter_definitions = function(){
    let emitter = new events.EventEmitter();
    global.events = emitter;
};

let checkVirtual = function(_url, cb) {
    cb && cb(_url.indexOf(setting.virtualRootPath) != -1);
};

let getExtention = function (_url) {
    return _url.match(/\.[0-9a-z]+$/i)[0];
}

var formatDate = function(date){
    let d = new Date(date);
    let dformat = `${(d.getMonth()+1).toString().padStart(2,"0")}-${d.getDate().toString().padStart(2,"0")}-${d.getFullYear().toString().padStart(2,"0")} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}:${d.getSeconds().toString().padStart(2,"0")}`;
    let dDate = `${(d.getMonth()+1).toString().padStart(2,"0")}-${d.getDate().toString().padStart(2,"0")}-${d.getFullYear().toString().padStart(2,"0")}`;
    let dTime =`${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}:${d.getSeconds().toString().padStart(2,"0")}`;
    /*if(dformat == 'NaN-NaN-NaN NaN:NaN:NaN'){ // date format is mm-dd-yyyy hh:MM:ss
      return date;
    }*/
    let result = {
        full: dformat,
        date : dDate,
        time : dTime
    };
    return result;
}

let defineFriendlyDate = function () {
    Date.prototype.friendlyDate = function () {
        return formatDate(this);
    }
};

let defineTokenValidation = function () {
    String.prototype.validateToken = function (){
        if (this === undefined){
            return false;
        }else if(this.length < 50 || this.length >50){
            return false;
        }
        return true;
    }
};
 
let redirect = function (res, path) {
    res.writeHead(302, {Location: path});
    res.end();
}

var getFolderFiles = function (dir, cb) {
    var results = [];
    var files = fs.readdirSync(dir);
    for (var i = 0; i < files.length; i++) {
        var file = files[i].replace(/\.[^/.]+$/, "");
        results.push(file);
    }
    cb && cb(results);
};

var sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let core = {
    sleep,
    getFolderFiles,
    initRouteConfigWatcher,
    queryStringToObject,
    redirect,
    defineTokenValidation,
    defineFriendlyDate,
    defineEmailValidation,
    emitter_definitions,
    getfileContentImg,
    getfileContent,
    callMethods,
    readFile,
    getFileNames,
    guid: GenerateGUID,
    GenerateToken,
    GeneratePassword,
    postHandler,
    getDictionaryFormData,
    getCallerIP,
    checkVirtual,
    getExtention,
    getActionName,
    request
};
module.exports = core;