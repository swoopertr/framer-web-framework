let render = require('./../Middleware/render');
let ccHelper = require('./../Helper/aws/codeCommit');
let gitHelper = require('./../Helper/gitHelper/git');
let zipHelper = require('./../Helper/zipHelper/zip');
let lamdaHelper = require('./../Helper/aws/lambda');
let repos = require('./../Config/Repositories.json');
let fs = require('fs');
let url = require('url');

let work = {
    getlist: async function (req, res) {
        let list_obj = fs.readFileSync('./src/Config/Repositories.json', 'utf8');
        list_obj = JSON.parse(list_obj);
        render.renderData(res, list_obj);
    },
    getInfo : async function(req, res) {
        let _url = url.parse(req.url, true).query;
        try {
            let result = await ccHelper.getRepository(_url.rn);
            render.renderData(res, result);    
        } catch (error) {
            render.renderData(res, error);
        }        
    },
    gitClone : async function (req, res) {
        let _url = url.parse(req.url, true).query;
        try {
            let info = await ccHelper.getRepository(_url.rn);
            let result = await gitHelper.gitClone(info.repositoryMetadata, _url.branch);
            render.renderData(res, {result});
        } catch (error) {
            render.renderData(res, error);
        }
    },
    makeZip : async function (req, res) {
        let _url = url.parse(req.url, true).query;
        try {
            console.time("makeZip");
            let info = await ccHelper.getRepository(_url.rn);
            await gitHelper.gitClone(info.repositoryMetadata, _url.branch);
            let folderName  = `temp_${info.repositoryMetadata.repositoryName}_${_url.branch}`;
            await zipHelper.makeZip(folderName, `${folderName}`);
            
            fs.rmSync(folderName, { recursive: true, force: true });
            let result = await lamdaHelper.lambda_fn_update(_url.fnName, `${folderName}.zip`);
            fs.rmSync(`${folderName}.zip`, { recursive: true, force: true });
            render.renderData(res, {result});
            console.timeEnd("makeZip");
        } catch (error) {
            render.renderData(res, error);
        }
    },
};


module.exports = work;