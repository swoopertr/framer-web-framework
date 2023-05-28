var views = {};

module.exports = {
  views:views,
  get:function (key) {
    return views[key];
  },
  set:function (key, val) {
    views[key] = val;
  },
  remove:function (key) {
    delete views[key];
  },
  list: function () {
    return views;
  }
};