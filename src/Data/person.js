var db = require('./../Data/sqlite/repo');
var person = {
    getlist: function (cb) {
        //go db take data return DATA.
        var list = [
            {
                id: 1,
                name: "Newton"
            },
            {
                id: 2,
                name: "Balzak"
            },
            {
                id: 3,
                name: "Tolstoy"
            }
        ];
        db.select('', function (result) {

            cb && cb(result);
        });
    },
    create : function (cb) {
        db.createDb();
    }
};


module.exports = person;