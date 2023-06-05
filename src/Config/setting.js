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

settings.root = '/Presentation/';
settings.rootPath = settings.root+'assets/';
settings.viewFolder = settings.root+'Pages/';
settings.allViewFolder = settings.root+'Pages/views/';
settings.virtualRootPath = '/virt/';

settings.controllerFolder = './Controller/';
settings.jsonPath = "/src/Config/Routes.json";
settings.ServerPort = process.env.PORT || 8081;

settings.errorController = './Controller/error';

settings.google = {
  client_id : "628577188418-pl5i3v54epjirm6t4gj3ukq8g9p1islp.apps.googleusercontent.com",
  client_secret : "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",
  project_id : "oauther-388108",
  auth_uri : "https://accounts.google.com/o/oauth2/auth",
  token_uri : "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url : "https://www.googleapis.com/oauth2/v1/certs",
  redirect_uris : [
    "http://localhost:8081/auth/redirect/google"
  ]
}

module.exports = settings;