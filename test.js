let zipHelper = require("./src/Helper/zipHelper/zip");
let crypto = require("crypto");

function getAllFiles() {
  let result = zipHelper.getAllFiles("./temp_assignment");
  zipHelper.makeZip("./temp_assignment", crypto.randomUUID());
  console.log(result);
}

getAllFiles();

