let AWS = require('aws-sdk');
AWS.config.update({
    region: "eu-west-1",
    accessKeyId: '<key1>',
    secretAccessKey: '<secret_key>',
});


let work = {
    lambda_fn_update: async function(fnName, zipFile) {
        //let dir = process.cwd()
        let lambda = new AWS.Lambda();
        let file = fs.readFileSync(zipFile)
        let params = {
            FunctionName: fnName,
            Publish: true,
            ZipFile : Buffer.from(file) 
        };
        return lambda.updateFunctionCode(params).promise();
    }
};

module.exports = work;
