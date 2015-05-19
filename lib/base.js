var async = require('async');
var base = {};

base.prompt = require('./prompt.js');
base.file = require('./file.js');
base.git = require('./git.js');

base.check = function check (params){
  base.createWebsite();
/*switch(params){
    case "Website": base.createWebsite();
                    break;
    case "Blog":    base.createblog();
                    break;  
    case "Docs":    base.createDocumentation();
                    break;
    default:        console.log("please specify website type");
}*/
    
};
base.createWebsite = function createWebsite() {
      async.series([
      function (callback) {
        base.git.fetchFromGithub(callback);
      },
      function (callback) {
        base.prompt.project(callback);
      },
      function (callback) {
        base.prompt.author(callback);
      },
      function (callback) {
        base.prompt.github(callback);
      },
      function (callback) {
        base.file.copyProject(callback);
      },
      function (callback) {
        base.git.pushToGit(callback);    
      }
    ]); 
};

module.exports = base;
