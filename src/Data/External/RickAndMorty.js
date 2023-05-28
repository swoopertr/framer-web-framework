var core = require('./../../Core');
var rickAndMortyBaseUri= 'rickandmortyapi.com';

var ramApi = {
    getChars: function (cb){
        core.request.get(rickAndMortyBaseUri,'/api/character', undefined, function (result){
            cb && cb (result.results);
        });
    },
    getNames: function (cb){
        ramApi.getChars(function (chars){
            var result = [];
            for (var i = 0; i< chars.length;i++){
                var charData = chars[i];
                result.push({
                    name: charData.name,
                    type: charData.type,
                    img:charData.image
                });
            }
            cb && cb(result);
        });


    }

}

module.exports = ramApi;
