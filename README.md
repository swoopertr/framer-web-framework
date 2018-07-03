
Framer nodejs web framework  
#Version 1.0

### How do I get set up? ###
* clone from git directory 
* then ready to code.
* zero Configuration if you want you can configure.
* no dependecies


### Start
* write terminal or command window 
 ```bash
 "node index.js"
 ```

### Features
* asp.net MVC like framework
* service your application as a REST/API or HTTP.

### Configuration
* in "src/Config" folder there is a Routes.js file. As you can see in the name this has routes
* ex: 
 ```bash
 "list":{
     "get":{
       "controller":"person", "function":"list"
     }
   }
 ```
in this example url is : http://localhost:8090/list
* this "**list**" means go to "**controller**" folder find "**person**" controller (person.js)  use "**list**" function



### Contribution guidelines ###

* Write code.
* make request wait to be done.