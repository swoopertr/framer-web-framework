exports.proj = {
  Title: 'Basic web site Frame'
};

exports.cpuCount = 1; //go as much cpu as your machine can.
exports.root = '/Presentation/';
exports.rootPath = exports.root+'assets/';
exports.viewFolder = exports.root+'Pages/';
exports.allViewFolder = exports.root+'Pages/views/';
exports.virtualRootPath = '/virt/';

exports.controllerFolder = './Controller/';
exports.jsonPath = "/src/Config/Routes.json";
exports.ServerPort = process.env.PORT || 5000;

exports.errorController = './Controller/error';