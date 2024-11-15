const ollama = require('ollama');
const VISION_MODEL = "llama3.2-vision:latest";


let work = {
    generate : async function(prompt, images){
        let ollamaObj = new  ollama.Ollama();
        const ollamaGenerateRequest = {
            model : VISION_MODEL,
            prompt,
            images,
            stream : false
        };
        const result = await ollamaObj.generate(ollamaGenerateRequest);
        return result.response;
    }
};

module.exports = work;