
const fs = require("fs")
const path = require("path")
const jszip = require("jszip");

let work = {
    getAllFiles : function(dirPath, arrayOfFiles) {
        files = fs.readdirSync(dirPath);
        arrayOfFiles = arrayOfFiles || [];
        
        files.forEach(function(file) {
            if(file.startsWith(".")) return;
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = work.getAllFiles(dirPath + "/" + file, arrayOfFiles);
            } else {
                let dir = process.cwd();
                let fullPath = path.join(dir, dirPath, "/", file);

                arrayOfFiles.push({fileName: fullPath.replace(dir,''), fullPath});
            }
        });
        return arrayOfFiles;
    },
    makeZip : async function (dirPath, zipName) {
        let zip = new jszip();
        let files = work.getAllFiles(dirPath);
        files.forEach(function(file) {
            if(file.fileName.startsWith(".git")) return;
            try {
                let content = fs.readFileSync(file.fullPath);
                zip.file(file.fileName, content);    
            } catch (error) {
                console.log(error);
            }
        });
        let content = await zip.generateAsync({
            type: "nodebuffer",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        });
        await fs.writeFileSync(`${zipName}.zip`, content);
    }
};

module.exports = work;