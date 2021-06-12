var settings ={
  proj : {
    Title: 'Basic web site Frame'
  }
};
settings.DdosLimitOptions = {
  seconds: 60,
  requestLimit:20,
  blockSeconds: 30
};
settings.tokenExpireTimeLimit= 6;
settings.superAdminGroupId = 3;
settings.cpuCount = 1; //go as much cpu as your machine can.
var numCPUs = (settings.cpuCount === 0) ? require('os').cpus().length : settings.cpuCount;
console.log('running on ' + numCPUs + ' instance');

settings.root = '\\Presentation\\';
settings.rootPath = settings.root+'assets\\';
settings.viewFolder = settings.root+'Pages\\';
settings.allViewFolder = settings.root+'Pages\\views\\';
settings.virtualRootPath = '\\virt\\';

settings.controllerFolder = '.\\Controller\\';
settings.jsonPath = "\\src\\Config\\Routes.json";
settings.ServerPort = process.env.PORT || 5000;

settings.errorController = '.\\Controller\\error';

module.exports = settings;