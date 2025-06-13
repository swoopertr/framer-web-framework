const WHISPER_CLI = "whisper-cli";
const WHISPER_APP_PATH = "./../../../../app/"
const WHISPER_MODEL_FOLDER_PATH = `${WHISPER_APP_PATH}models/`;
const WHISPER_MODEL_SOUNDFILE_FOLDER_PATH = `${WHISPER_APP_PATH}samples/`;
const WEBAPP_DOWNLOAD_FOLDER_PATH = "./Presentation/Download/";
const WHISPER_MODEL_OUTPUT_FOLDER_PATH = `${WEBAPP_DOWNLOAD_FOLDER_PATH}output/`;


// const WHISPER_CLI = "/Users/tunc/Documents/dev/python/whisper.cpp/build/bin/whisper-cli";
// const WHISPER_APP_PATH = "/Users/tunc/Documents/dev/python/whisper.cpp/"
// const WHISPER_MODEL_FOLDER_PATH = `${WHISPER_APP_PATH}models/`;
// const WHISPER_MODEL_SOUNDFILE_FOLDER_PATH = `${WHISPER_APP_PATH}samples/`;
// const WEBAPP_DOWNLOAD_FOLDER_PATH = "./Presentation/Download/";
// const WHISPER_MODEL_OUTPUT_FOLDER_PATH = `${WEBAPP_DOWNLOAD_FOLDER_PATH}output/`;



let work = {
    
    commandBuilder: function (model="ggml-large-v3-turbo.bin", language='tr', soundFile, outputFile='output') {
        //whisper-cli -m ./../../../../app/models/ggml-large-v3-turbo.bin -f ./../../../../app/samples/rec1.mp3 -l tr -oj -of ./Presentation/Download/kel
        let whisperCommand ='';
        if(soundFile){
            whisperCommand =`${WHISPER_CLI} -m ${WHISPER_MODEL_FOLDER_PATH + model} -f ${WHISPER_MODEL_SOUNDFILE_FOLDER_PATH + soundFile} -l ${language} -oj -of ${WHISPER_MODEL_OUTPUT_FOLDER_PATH + outputFile}`;
        }
        return whisperCommand;
    },
    commandBuilderForSpawn : function (model="ggml-large-v3-turbo.bin", language='tr', soundFile, outputFile='output') {
        //whisper-cli -m ./../../../../app/models/ggml-large-v3-turbo.bin -f ./../../../../app/samples/rec1.mp3 -l tr -oj -of ./Presentation/Download/kel
        return {command : WHISPER_CLI, args: ['-m', `${WHISPER_MODEL_FOLDER_PATH + model}`, '-f', `${WHISPER_MODEL_SOUNDFILE_FOLDER_PATH + soundFile}`, '-l', `${language}`, '-oj', '-of', `${WHISPER_MODEL_OUTPUT_FOLDER_PATH + outputFile}`]};
    }
}

module.exports = work;