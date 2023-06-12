let AWS = require('aws-sdk');
AWS.config.update({
    region: "eu-west-1",
    accessKeyId: '<key1>',
    secretAccessKey: '<secret_key>',
});


let work = {
    //getting allfiles from codecommit related repository
    getRepository : function(repositoryName) {
        let codecommit = new AWS.CodeCommit();
        let params = {
            repositoryName: repositoryName
        };
        return codecommit.getRepository(params).promise();
    }
};

module.exports = work;
