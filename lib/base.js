var async = require('async');
var chalk = require('chalk');
var base = {};

base.prompt = require('./prompt.js');
base.file = require('./file.js');
base.git = require('./git.js');

base.create = function create (type){
    if (type === "website"){
      base.createWebsite();
    }else if (type === "blog"){
      //base.createBlog();
    }else if (type === "docs"){
      //base.createdocs();
    }else{
      console.log(chalk.red("Wrong argument!\nValid arguments with this command are :website, blog, docs."));
    }
};
base.createWebsite = function createWebsite() {
      async.series([
      function (callback) {
        base.git.fetchFromGithub("website",callback);
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
        base.git.initilizeGit(callback);    
      }
    ]); 
};
base.createBlog = function createBlog() {
      async.series([
      function (callback) {
        base.git.fetchFromGithub("blog",callback);
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
        base.git.initilizeGit(callback);    
      }
    ]); 
};

module.exports = base;