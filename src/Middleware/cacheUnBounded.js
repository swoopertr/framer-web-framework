'use strict';
var cluster = require('cluster');
var messagesCounter = 0;
var activeMessages = {};
var purgeIntervalObj;
var cache = {};

var masterMessagesHandlerMap = {
    'read': _readCacheValue,
    'store': _storeCacheValue,
    'remove': _removeCacheValue,
    'clean': _cleanCache,
    'size': _getCacheSize,
    'keys': _getCacheKeys,
    'unknown': function (msg) {
        console.warn('Received an invalid message type:', msg.type);
    }
};

function CacheEntry(data) { // ttl -> milliseconds
    this.key = data.key;
    this.value = data.value;
    this.creationTime = Date.now();
    if (data.ttl) {
        this.ttl = data.ttl;
        this.expirationTime = this.creationTime + data.ttl;
    }
}

CacheEntry.prototype.isExpired = function () {
    return this.expirationTime && Date.now() > this.expirationTime;
};
CacheEntry.prototype.toString = function () {
    return "Key: " + this.key + "; Value: " + this.value + "; Ttl: " + this.ttl;
};

function _findWorkerByPid(workerPid) {
    var workerIds = Object.keys(cluster.workers),
        len = workerIds.length,
        worker;
    for (var i = 0; i < len; i++) {
        if (cluster.workers[workerIds[i]].process.pid == workerPid) {
            worker = cluster.workers[workerIds[i]];
            break;
        }
    }
    return worker;
}

function _getResultParamsValues(paramsObj) {
    var result = [null],
        prop;
    if (paramsObj) {
        for (prop in paramsObj) {
            result.push(paramsObj[prop]);
        }
    }
    return result;
}

function _sendMessageToWorker(message) {
    var worker = _findWorkerByPid(message.workerPid);
    worker.send(message);
}

function _sendMessageToMaster(message) {
    message.channel = 'memored';
    message.workerPid = process.pid;
    message.id = process.pid + '::' + messagesCounter++;
    process.send(message);
    if (message.callback) {
        activeMessages[message.id] = message;
    }
}

function _readCacheValue(message) {
    var cacheEntry = cache[message.requestParams.key];
    if (!cacheEntry) return _sendMessageToWorker(message);
    if (cacheEntry.isExpired()) {
        process.nextTick(function () {
            delete cache[message.requestParams.key];
        });
        cacheEntry = null;
    }

    if (cacheEntry) {
        message.responseParams = {
            value: cacheEntry.value
        };
        if (cacheEntry.expirationTime) {
            message.responseParams.expirationTime = cacheEntry.expirationTime;
        }
    }
    _sendMessageToWorker(message);
}

function _storeCacheValue(message) {
    cache[message.requestParams.key] = new CacheEntry(message.requestParams);
    if (message.requestParams.ttl) {
        message.responseParams = {
            expirationTime: cache[message.requestParams.key].expirationTime
        };
    }
    _sendMessageToWorker(message);
}

function _removeCacheValue(message) {
    delete cache[message.requestParams.key];
    _sendMessageToWorker(message);
}

function _cleanCache(message) {
    cache = {};
    _sendMessageToWorker(message);
}

function _getCacheSize(message) {
    message.responseParams = {
        size: Object.keys(cache).length
    };
    _sendMessageToWorker(message);
}

function _getCacheKeys(message) {
    message.responseParams = {
        keys: Object.keys(cache)
    };
    _sendMessageToWorker(message);
}

function _purgeCache() {
    var now = Date.now();
    Object.keys(cache).forEach(function (cacheKey) {
        if (cache[cacheKey].expirationTime && cache[cacheKey].expirationTime < now) {
            delete cache[cacheKey];
        }
    });
}

function _masterIncomingMessagesHandler(message) {
    console.log('Master received message:', message);
    if (!message || message.channel !== 'memored') return false;
    var handler = masterMessagesHandlerMap[message.type] || masterMessagesHandlerMap.unknown;
    handler(message);
}

function _workerIncomingMessagesHandler(message) {
    if (!message || message.channel !== 'memored') return false;
    var pendingMessage = activeMessages[message.id];
    if (pendingMessage && pendingMessage.callback) {
        pendingMessage.callback.apply(null, _getResultParamsValues(message.responseParams));
        delete activeMessages[message.id];
    }
}

function _setup(options) {
    options = options || {};

    if (cluster.isMaster) {
        if (options.purgeInterval) {
            purgeIntervalObj = setInterval(function () {
                _purgeCache();
            }, options.purgeInterval).unref();
        }
    }
}

function _read(key, cb) {
    if (cluster.isWorker) {
        _sendMessageToMaster({
            type: 'read',
            requestParams: {
                key: key
            },
            callback: cb
        });
    } else {
        console.warn('Memored::read# Cannot call this function from master process');
    }
}

function _multiRead(keys, cb) {
    var counter = 0,
        results = {};

    function _multiReadCallback(err, value, expirationTime) {
        if (value) {
            results[keys[counter]] = {
                value: value,
                expirationTime: expirationTime
            };
        }

        if (++counter >= keys.length) {
            cb && cb(err, results);
        }
    }

    if (cluster.isWorker) {
        if (!Array.isArray(keys)) {
            return console.warn('Memored::multiRead# First parameter must be an array');
        }

        keys.forEach(function (key) {
            _read(key, _multiReadCallback);
        });
    } else {
        console.warn('Memored::read# Cannot call this function from master process');
    }
}

function _store(key, value, ttl, cb) {
    if (cluster.isWorker) {
        if (typeof ttl === 'function') {
            cb = ttl;
            ttl = undefined;
        }

        _sendMessageToMaster({
            type: 'store',
            requestParams: {
                key: key,
                value: value,
                ttl: ttl
            },
            callback: cb
        });
    } else {
        console.warn('Memored::store# Cannot call this function from master process');
    }
}

function _multiStore(map, ttl, cb) {
    var keys,
        _expirationTime,
        counter = 0;

    if (cluster.isWorker) {
        if (typeof ttl === 'function') {
            cb = ttl;
            ttl = undefined;
        }

        keys = Object.keys(map);
        keys.forEach(function (key) {
            _store(key, map[key], ttl, function _callback(err, expirationTime) {
                counter++;
                if (keys[0] === key) {
                    _expirationTime = expirationTime;
                } else if (counter === keys.length && cb) {
                    cb(err, _expirationTime);
                }
            });
        });
    } else {
        console.warn('Memored::multiStore# Cannot call this function from master process');
    }
}

function _remove(key, cb) {
    if (cluster.isWorker) {
        _sendMessageToMaster({
            type: 'remove',
            requestParams: {
                key: key
            },
            callback: cb
        });
    } else {
        console.warn('Memored::remove# Cannot call this function from master process');
    }
}

function _multiRemove(keys, cb) {
    var counter = 0;

    function _multiRemoveCallback() {
        if (++counter >= keys.length && cb) {
            cb();
        }
    }

    if (cluster.isWorker) {
        if (!Array.isArray(keys)) {
            return console.warn('Memored::multiRemove# First parameter must be an array');
        }

        keys.forEach(function (key) {
            _remove(key, _multiRemoveCallback);
        });

    } else {
        console.warn('Memored::remove# Cannot call this function from master process');
    }
}

function _clean(cb) {
    if (cluster.isWorker) {
        _sendMessageToMaster({
            type: 'clean',
            callback: cb
        });
    } else {
        console.warn('Memored::clean# Cannot call this function from master process');
    }
}

function _size(cb) {
    if (cluster.isWorker) {
        _sendMessageToMaster({
            type: 'size',
            callback: cb
        });
    } else {
        setImmediate(cb, null, {
            size: Object.keys(cache).length
        });
    }
}

function _reset() {
    if (cluster.isMaster) {
        clearInterval(purgeIntervalObj);
        cache = {};
    } else {
        console.warn('Memored::reset# Cannot call this function from a worker process');
    }
}

function _keys(cb) {
    if (cluster.isWorker) {
        _sendMessageToMaster({
            type: 'keys',
            callback: cb
        });
    } else {
        setImmediate(cb, {
            keys: Object.keys(cache)
        });
    }
}

if (cluster.isMaster) {
    Object.keys(cluster.workers).forEach(function (workerId) {
        cluster.workers[workerId].on('message', _masterIncomingMessagesHandler);
    });

    // Listen for new workers so we can listen to its messages
    cluster.on('fork', function (worker) {
        worker.on('message', _masterIncomingMessagesHandler);
    });

} else {
    process.on('message', _workerIncomingMessagesHandler);
}

module.exports = {
    setup: _setup,
    read: _read,
    multiRead: _multiRead,
    store: _store,
    multiStore: _multiStore,
    remove: _remove,
    multiRemove: _multiRemove,
    clean: _clean,
    size: _size,
    reset: _reset,
    keys: _keys
};