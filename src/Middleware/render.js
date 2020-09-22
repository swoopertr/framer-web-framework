var defaults = require('./../Config/Defaults/Default');
var setting = require('./../Config/setting');
var core = require('./../Core');
var fs = require('fs');
var cache = require('./cacheFrame');
var view = require('./ViewPack');

var dir = process.cwd();

var initWatchfiles = function () {
    var opt = {
        recursive: true
    };
    fs.watch(dir + setting.root, opt, function (err, content) {
        if (!global.fsTimeout) {
            global.fsTimeout = setTimeout(function () {
                render.init(function () {
                    console.log('files reloaded');
                    delete global.fsTimeout;
                });
            }, 2000);
        }
    });
};

var render = {
    initWatcher: initWatchfiles,
    init: function (cb) {
        var funcArr = [];
        funcArr.push(
            getHtmlfooter,
            getHtmlheader,
            getMaster);

        core.callMethods(funcArr, 0, function () {
            core.getFileNames(dir + setting.allViewFolder, function (listfiles) {
                for (var i = 0; i < listfiles.length; i++) {
                    var content = fs.readFileSync(dir + setting.allViewFolder + listfiles[i].controller + '/' + listfiles[i].view + '.tht', "utf8");
                    console.log('content >> ' + dir + setting.allViewFolder + listfiles[i].controller + '/' + listfiles[i].view + '.tht readed');
                    preCache(content, function (ManuplatedContent) {
                        if (view.views.hasOwnProperty(listfiles[i].controller)) {
                            view.views[listfiles[i].controller][listfiles[i].view] = ManuplatedContent;
                        } else {
                            view.views[listfiles[i].controller] = {};
                            view.views[listfiles[i].controller][listfiles[i].view] = ManuplatedContent;
                        }
                    });
                }
                console.log('files loading finished.');
                cb && cb();
            });
        });
    },
    renderHtml: function (res, html, data, cb) {
        dataRender(html, data, function (result) {
            res.writeHead(200, defaults.TheHeaderHtml);
            res.write(result);
            res.end();
            cb && cb();
        });
    },
    renderData: function (res, data, type) {
        switch (type) {
            case 'json':
                res.writeHead(200, defaults.TheHeaderJson);
                break;
            case 'xml':
                res.writeHead(200, defaults.TheHeaderXml);
                break;
            default:
                res.writeHead(200, defaults.TheHeaderJson);//default json
                break;
        }
        res.write(JSON.stringify(data));
        res.end();
    }
};

var preCache = function (content, cb) {
    var master = cache.get("::master");
    var headerData = cache.get("::header");
    var footerData = cache.get("::footer");
    master = master.replace(new RegExp('<%footer%>', 'g'), footerData ? footerData : '');
    master = master.replace(new RegExp('<%header%>', 'g'), headerData ? headerData : '');
    master = master.replace(new RegExp('<%page.body%>', 'g'), content);
    //this makes putting setting proj values in to the all pages. works like
    for (var prop in setting.proj) {
        master = master.replace(new RegExp('<%proj.' + prop + '%>', 'g'), setting.proj[prop]);
    }
    cb && cb(master);
};

var dataRender = function (html, data, cb) {
    html = html.replace(new RegExp('<%page.header%>', 'g'), ((data.header) ? data.header : ''));
    html = html.replace(new RegExp('<%page.footer%>', 'g'), ((data.footer) ? data.footer : ''));
    html = tengine(html, data);
    cb && cb(html);
};

var tengine = function (html, data) {
    for (var prop in data) {
        html = html.replace(new RegExp('{{this.' + prop + '}}', 'g'), data[prop]);
    }
    return html;
};

var getMaster = function (cb) {
    core.readFile(dir + setting.viewFolder + 'master.tht', function (content) {
        cache.set("::master", content);
        cb && cb();
    });
};
var getHtmlheader = function (cb) {
    core.readFile(dir + setting.viewFolder + 'header.tht', function (content) {
        cache.set("::header", content);
        cb && cb();
    });
};
var getHtmlfooter = function (cb) {
    core.readFile(dir + setting.viewFolder + 'footer.tht', function (err, content) {
        cache.set("::footer", content);
        cb && cb();
    });
};

module.exports = render;