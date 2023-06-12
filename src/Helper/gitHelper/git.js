var shell = require("shelljs");

let work = {
    gitClone: async function (info, branch='main') {
        try {
            await shell.exec(`git clone ${info.cloneUrlHttp} -b ${branch} temp_${info.repositoryName}_${branch}`);
            await shell.cd(`temp_${info.repositoryName}_${branch}`);
            await shell.exec(`npm i`);  
            await shell.cd(`..`);
            return true;
        } catch (error) {
            return error;
        }
    }
};

module.exports = work;