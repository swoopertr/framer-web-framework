var header = {
  addHeader: function (res, header, cb) {
    if (Array.isArray(header)) {
      for (var i = 0; i < header.length; i++) {
        res.setHeader(header[i].key, header[i].value);
      }
    } else {
      res.setHeader(header.key, header.value);
    }
    cb && cb(res);
  },
  removeHeader: function (res, key, cb) {
    //todo: remove single header...
  },
  addHeaderAsync: function (res, header){
    return new Promise((resolve, reject) => {
      header.addHeader(res, header, function (resp){
        resolve(resp);
      });
    });
  }
};

module.exports = header;