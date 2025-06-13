const { exec, spawn, spawnSync } = require("child_process");


let work = {
    runTerminalCommand: function (command, cb, cbError) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                cbError && cbError({ error, stderr });
                return;
            }
            if (stderr) {
                cbError && cbError({ error, stderr });
                return;
            }
            cb && cb(stdout);
        });
    },

    runSpawnCommand: function (command, prms, cb, cbError) {

        //const child = spawn('ls', ['-lh', '/usr']);
        const child = spawn(command, prms);

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            cb && cb(data);

        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            cbError && cbError({ error: data });
        });

        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            cbError && cbError({ error: code });
        });
    }

}
module.exports = work;