
Framer simpliest nodejs web framework ever
#Version 1.1
###About
Simple or Micro framework :) whatever you called. 
It is similar with .net MVC framework structure.
Make things easier and faster.
### How do I get set up? ###
* clone from git directory 
* then ready to code.
* zero configuration, if you want to configure, you can configure too.
* no dependecies at all.
* so just download and needed nodejs.exe :)

### Start
* write terminal or command window 
 ```bash
 "node index.js"
 ```
 Hola! You make server run. It is too hard.

### Features
* asp.net MVC like framework
* your application can be a REST/API, HTTP or Both.
* dynamic route loader.
* fast as native !!!
* session and cookie support added. 

### Configuration

####Route config:
* Configuration file located at "src/Config/Routes.json" as setting.js. 
Changing **Routes.json** file in live makes reload the all route configuration.

example: 
 ```bash
 "list":{
     "get":{
       "controller":"person", "function":"list"
     }
   }
   ==> http://localhost:8090/list
 ```

In this example : "**person**" controller (person.js) run "list"  function

When you change something in "Presentation" layer makes reload related view.

####Configure Paths
 You can reconfigure path configurations for your enviroment in **src/Config/setting.js**.
```bach
exports.cpuCount = 1; //go as much cpu as your machine can.
exports.root = '/Presentation/'; 
exports.rootPath = '/Presentation/assets/'; //determine the assets paths
exports.viewFolder = '/Presentation/Pages/'; //general wiev folder master template, header and footer.
exports.allViewFolder = '/Presentation/Pages/views/'; //matches with controller and controller functions
exports.virtualRootPath = '/virt/';  //means virtual folder - http://localhost:8090/virt/scripts/main.js

exports.controllerFolder = './controller/'; 
exports.jsonPath = "/src/Config/Routes.json";
exports.ServerPort = 8090;

exports.errorController = './controller/error';
``` 


### Contribution guidelines ###
* Write code and make pull request.