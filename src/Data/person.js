var person = {
  getlist:function (cb) {
    //go db take data and callback.
    var list = [
      {
        id: 1,
        name: "Newton"
      },
      {
        id:2,
        name:"Balzak"
      }
    ];
    if (typeof cb !== 'undefined'){
      cb(list);
    }

  }
};


module.exports = person;