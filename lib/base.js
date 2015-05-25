/**
 * Provides the base object
 * @module base
 */
var async = require('async');
var chalk = require('chalk');
/**
 * Provides the base object
 * @class base
 */
var base = {};

base.prompt = require('./prompt.js');
base.file = require('./file.js');
base.git = require('./git.js');
/**
 * Call the function to create new website of one of the following three types: website, blog, docs.
 * 
 * @method create
 * @param type {String} The type of website to create. 'website', 'blog' and 'docs' are allowed only.
 */
base.create = function(type) {
    if (type === "website") {
        base.createWebsite();
    } else if (type === "blog") {
        //base.createBlog();
    } else if (type === "docs") {
        //base.createdocs();
    } else {
        console.log(chalk.red("Wrong argument!\nValid arguments with this command are :website, blog, docs."));
    }
};
/**
 * Create a new website.
 * 
 * @method createWebsite
 */
base.createWebsite = function() {
    async.series([
        function(callback) {
            if (!base.file.isDirectoryEmpty()) {
                console.log(chalk.red("Directory is not empty. This command can only run in an empty directory."));
                return;
            } else {
                callback();
            }
        },
        function(callback) {
            base.git.fetchFromGithub("website", callback);
        },
        function(callback) {
            base.prompt.project(callback);
        },
        function(callback) {
            base.prompt.author(callback);
        },
        function(callback) {
            base.prompt.github(callback);
        },
        function(callback) {
            base.file.copyWebsite(callback);
        },
        function(callback) {
            base.git.initilizeGit(callback);
        }
    ]);
};
/**
 * Create a new blog.
 * 
 * @method createBlog
 */
base.createBlog = function() {
    async.series([
        function(callback) {
            base.git.fetchFromGithub("blog", callback);
        },
        function(callback) {
            base.prompt.project(callback);
        },
        function(callback) {
            base.prompt.author(callback);
        },
        function(callback) {
            base.prompt.github(callback);
        },
        function(callback) {
            //base.file.copyBlog(callback);
        },
        function(callback) {
            base.git.initilizeGit(callback);
        }
    ]);
};

module.exports = base;