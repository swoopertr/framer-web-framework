let AWS = require('aws-sdk');
AWS.config.update({
    region: "eu-west-1",
    accessKeyId: 'AKIA5LEV54CLLFX4EZPT',
    secretAccessKey: '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',
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