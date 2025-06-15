const OLLAMA_URL = "http://localhost:11434/";
const OLLAMA_MODEL = "tinyllama:latest";
let work = {
    askToAi : async function (question) {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "model": OLLAMA_MODEL,
            "prompt": question,
            "stream": false
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${OLLAMA_URL}api/generate`, requestOptions);
            const result = await response.json();
            console.log(result)
            return result;
            
        } catch (error) {
            console.error(error);
            return {
                error: error
            }
        };
    }
};
module.exports = work;
