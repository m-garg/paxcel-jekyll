var async = require('async');
var base = {};

base.prompt = require('./prompt.js');
base.file = require('./file.js');
base.git = require('./git.js');

base.check = function check (){

    async.series([
      function (callback) {
        base.git.fetchFromGithub(callback);
      },
      function (callback) {
        console.log("sasa");
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
