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
        if (typeof cb !== 'undefined') {
            cb(list);
        }

    }
};


module.exports = person;