var person = {
    getlist: function (cb) {
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
        cb && cb(list);
    },
    create: function (cb) {

    }
};


module.exports = person;