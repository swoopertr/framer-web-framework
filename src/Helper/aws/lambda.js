let AWS = require('aws-sdk');
let fs = require('fs');
AWS.config.update({
    region: "eu-west-1",
    accessKeyId: 'AKIA5LEV54CLLFX4EZPT',
    secretAccessKey: '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',
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