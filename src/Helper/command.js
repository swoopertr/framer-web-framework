const { exec } = require("child_process");


let work = {
    runTerminalCommand : function (command, cb, cbError) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                cbError && cbError({error, stderr});
                return;
            }
            if (stderr) {
                cbError && cbError({error, stderr});
                return;
            }
            cb && cb(stdout);
        });
    }
}
module.exports = work;