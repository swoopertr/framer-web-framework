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
            console.log(`stdout: ${data.toString()}`);
            cb && cb(data.toString());
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data.toString()}`);
            //cbError && cbError({ error: data.toString() });
        });

        child.on('close', (code) => {
            console.log(`child process exited with code ${code.toString()}`);
            //cbError && cbError({ error: code.toString() });
        });
    }

}
module.exports = work;