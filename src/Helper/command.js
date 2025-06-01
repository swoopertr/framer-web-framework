const { exec } = require("child_process");


let work = {
    runTerminalCommand : function (command, cb, cbError) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                cbError && cbError(error);
                return;
            }
            if (stderr) {
                cbError && cbError(stderr);
                return;
            }
            cb && cb(stdout);
        });
    }
}
module.exports = work;