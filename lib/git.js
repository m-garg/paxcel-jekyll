/**
 * Various functions related to git and github.
 * @module base
 * @submodule git
 */
var infoToRender = require("./infoToRender.js");
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var GitHubApi = require('github');
var chalk = require('chalk');
var file = require('./file.js');
var githubOptions = {
    version: '3.0.0'
};
var github = new GitHubApi(githubOptions);
/**
 * Various functions related to git and github.
 * @class git
 */
var git = module.exports;

/**
 * Initilize current directory as git directory.
 * @method initilizeGit
 */
git.initilizeGit = function(callback) {
    this.githubAuth(infoToRender.githubUserName, infoToRender.githubPassword);
    github.repos.create({
        name: infoToRender.githubRepoName
    }, function(err, res) {
        if (err) {
            console.log(chalk.red("\nError creating new repository : " + err));
            if (err.message == "Bad credentials") {
                console.log(chalk.red("Either username or password is incorrect."));
            } else if (err.message == "Validation Failed") {
                console.log(chalk.red("Repository already exists!\nPlease use a different repository name."));
            }
            process.exit(1);
        } else {
            console.log(chalk.green("\nNew repository created: " + infoToRender.githubRepoName));
        }
        execSync('git init');
        execSync('git config core.autocrlf true');
        execSync('git add .');
        execSync('git commit -m "Initial_commit"');
        execSync('git remote add origin https://github.com/' + infoToRender.githubUserName + '/' + infoToRender.githubRepoName + '.git');
        execSync('git branch gh-pages');
        console.log(chalk.yellow("\nPlease enter your Github username and password again."));
        execSync('git push origin gh-pages');
        console.log(chalk.green("\nEverything done : You site is now live on "));
        console.log(chalk.yellow(infoToRender.githubUserName + ".github.io/" + infoToRender.githubRepoName));
        //for windows open browser 
        //	execSync('start chrome'+infoToRender.githubUserName + '.github.io/' + infoToRender.githubRepoName);
        if (typeof callback === "function") {
            callback(null);
        }
    });
};
/**
 * Autheticate user github credentials.
 * @method githubAuth
 * @param username {String} Github username
 * @param password {String} Github password
 */
git.githubAuth = function(username, password) {
    github.authenticate({
        type: "basic",
        username: username,
        password: password
    });
};
/**
 * Fetch the base template from github.
 * @method fetchFromGithub
 * @param type {String} The type of website to create. 'website', 'blog' and 'docs' are allowed only.
 */
git.fetchFromGithub = function(type, callback) {
    var gitRepoUrl;
    if (type === "blog") {
        gitRepoUrl = "https://github.com/manishGarg57/blog-template.git";
    } else if (type === "website") {
        gitRepoUrl = "https://github.com/manishGarg57/website-template.git";
    } else if (type === "docs"){
        gitRepoUrl = "https://github.com/manishGarg57/docs-template.git";
    }
    if (file.baseTemplateExist()) {
        //delete it
        file.removeBaseTemplate();
        //pull
        /*exec('cd ' + file.sourceRootPath() + ' & git pull ' + gitRepoUrl + ' master', function(error, stdout, stderr) {
            //console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
            if (error) {
                console.log('exec error: ' + error);
            }
            if (typeof callback === "function") {
                callback(null);
            }
        });*/
    }
        //clone	
        exec('git clone ' + gitRepoUrl + ' ' + file.sourceRootPath(), function(error, stdout, stderr) {
            //console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
            if (error) {
                console.log('Unexpected error occured');
                throw error;
            }
            if (typeof callback === "function") {
                callback(null);
            }
        });
};
git.configureForFirstTimeUse = function () {
    console.log(chalk.yellow("\nSetting git user.name and email for first time use."));
	execSync('git config --global user.name '+infoToRender.githubUserName); 
	execSync('git config --global user.email '+infoToRender.email);
};
/*
git.pushToGithub = function(callback) {
    exec('git push origin gh-pages', function(error, stdout, stderr) {
        if (error) {
            console.log(chalk.red("Error occured while pushing code. " + stderr));
        } else {
            console.log(chalk.green("Successfully pushed"));
        }
    });
};
*/