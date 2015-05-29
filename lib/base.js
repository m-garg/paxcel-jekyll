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
    if (!base.file.isDirectoryEmpty()) {
        console.log(chalk.red("Directory is not empty. This command can only run in an empty directory."));
        return;
    }

    if (type === "website") {
        base.createWebsite();
    } else if (type === "blog") {
        base.createBlog();
    } else if (type === "docs") {
        base.createDocs();
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
            console.log(chalk.yellow("Please wait. Loading templates....."));
            base.git.fetchFromGithub("website", callback);
        },
        function(callback) {
            console.log(chalk.grey("Some details about the your website"));
            base.prompt.project(callback);
        },
        function(callback) {
            console.log(chalk.grey("Github details"));
            base.prompt.github(callback);
        },
        function(callback) {
            console.log(chalk.grey("Some info for social updates. You can leave it now and update it later in _config.xml file"));
            base.prompt.social(callback);
        },
        function(callback) {
            console.log(chalk.grey("Creating website"));
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
            console.log(chalk.yellow("Please wait. Loading templates....."));
            base.git.fetchFromGithub("blog", callback);
        },
        function(callback) {
            console.log(chalk.grey("Some details about the your website"));
            base.prompt.project(callback);
        },
        function(callback) {
            base.prompt.blogOnly(callback);
        },
        function(callback) {
            console.log(chalk.grey("Github details"));
            base.prompt.github(callback);
        },
        function(callback){
            console.log(chalk.grey("Author details"));
            base.prompt.author(callback);
        },    
        function(callback) {
            base.file.copyBlog(callback);
        },
        function(callback) {
            base.git.initilizeGit(callback);
        }
    ]);
};
/**
 * Create a new documentation website.
 * 
 * @method createDocs
 */
base.createDocs = function() {
    async.series([
        function(callback) {
            console.log(chalk.yellow("Please wait. Loading templates....."));
            base.git.fetchFromGithub("docs", callback);
        },
        function(callback) {
            base.prompt.project(callback);
        },
        function(callback) {
            console.log(chalk.grey("Github details"));
            base.prompt.github(callback);
        },
        function(callback) {
            console.log(chalk.grey("Some info for social updates. You can leave it now and update it later in _config.xml file"));
            base.prompt.social(callback);
        },
        function(callback) {
            console.log(chalk.grey("Creating website"));
            base.file.copyDocs(callback);
        },
        function(callback) {
            base.git.initilizeGit(callback);
        }
    ]);
};
module.exports = base;