var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('.db/db.sqlite', function (err) {
    if (err) {
        console.log(err.message);
    }
    console.log('Connection successful');
});


db.close(function (err) {
    if (err) {
        console.log(err.message);
    }
    console.log('closed successful');
});


var cruds = {
    createDb: function(){
        var db = new sqlite3.Database(':memory:', sqlite3.OPEN_READONLY, function (err) {
            if (err) {
                console.log(err.message);
            }
            //console.log('Connection successful');
        });
        var result = [];
        db.serialize(function () {
            db.run('CREATE TABLE users\n' +
                '        (\n' +
                '            id integer PRIMARY KEY AUTOINCREMENT NOT NULL,\n' +
                '            name varchar(150) NOT NULL,\n' +
                '            age int NOT NULL\n' +
                '    );\n' +
                '        CREATE UNIQUE INDEX users_id_uindex ON users (id);', function (err, row) {
                    if (err) {
                        console.error(err.message);
                    }
                    //console.log(row.id + "\t" + row.name);
                    result.push(row);
                },
                function (err, rowCount) {
                    if (err) {
                        console.error(err.message);
                    }
                    //console.log('query completed and returned : ' + rowCount + ' rows');
                    cb && cb(result);
                    db.close();
                });
        });


    },

    select: function (q, cb) {
        //var db = new sqlite3.Database('./src/db/db.sqlite', sqlite3.OPEN_READONLY, function (err) {
        var db = new sqlite3.Database(':memory:', sqlite3.OPEN_READONLY, function (err) {
            if (err) {
                console.log(err.message);
            }
            //console.log('Connection successful');
        });
        var result = [];
        db.serialize(function () {
            db.each('select * from users', function (err, row) {
                    if (err) {
                        console.error(err.message);
                    }
                    //console.log(row.id + "\t" + row.name);
                    result.push(row);
                },
                function (err, rowCount) {
                    if (err) {
                        console.error(err.message);
                    }
                    //console.log('query completed and returned : ' + rowCount + ' rows');
                    cb && cb(result);
                    db.close();
                });
        });
    }

};
module.exports = cruds;