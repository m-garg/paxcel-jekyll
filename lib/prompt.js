/**
 * Various functions related to prompting.
 * @module base
 * @submodule prompt
 */
var inquirer = require("inquirer");
var infoToRender = require("./infoToRender.js");
var add = require("./add.js");
var remove = require("./remove.js");
/**
 * Various functions related to prompting.
 * @class prompt
 */
var prompt = module.exports;
/**
 * Prompt for creating website.
 * @method all
 */
prompt.all = function(callback) {
    var prompts = [{
        name: "projectName",
        message: "What is the name of your project?"
    }, {
        name: "projectDescription",
        message: "Describe your project for me:"
    }, {
        name: "projectTagline",
        message: "What is the tag line for your project?"
    }, {
        name: "projectKeywords",
        message: "Give the keywords related to your website"
    }, {
        name: "cname",
        message: "If you want to use custom domain for this website, enter it ",
        default: ""
    }, {
        name: "authorName",
        message: "What is your name?",
    }, {
        name: "authorEmail",
        message: "What is your email?",
    }, {
        name: "authorBio",
        message: "Write a short description of yourself:"
    }, {
        name: "authorTwitter",
        message: "Your Twitter user name:"
    }, {
        name: "githubUserName",
        message: "What is your Github username?",
    }, {
        name: "githubPassword",
        type: 'password',
        message: "What is your password?",
    }, {
        name: "githubRepoName",
        message: "Give the new repository name to create",
        default: "my-site"
    }, {
        name: "githubConfig",
        confirm: "confirm",
        message: "Is this the first time you are using git on this system?(yes/no)",
        default: "no"
    }];
    inquirer.prompt(prompts, function(answers) {
        for (var key in answers) {
            if (answers.hasOwnProperty(key)) {
                infoToRender[key] = answers[key];
            }
        }
        if (typeof callback === "function") {
            callback(null);
        }
    });
};
/**
 * Project related prompts.
 * @method project
 */
prompt.project = function(callback) {
    var prompts = [{
        name: "projectName",
        message: "What is the name of your project?"
    }, {
        name: "projectDescription",
        message: "Describe your project:"
    }, {
        name: "email",
        message: "email id for contact?"
    }, {
        name: "projectKeywords",
        message: "Give the keywords related to your website"
    }, {
        name: "cname",
        message: "If you want to use custom domain for this website, enter it ",
        default: ""
    }];
    inquirer.prompt(prompts, function(answers) {
        for (var key in answers) {
            if (answers.hasOwnProperty(key)) {
                infoToRender[key] = answers[key];
            }
        }
        if (typeof callback === "function") {
            callback(null);
        }
    });
};
/**
 * Author related prompts.
 * @method author
 */
prompt.author = function(callback) {
    var prompts = [{
        name: "authorName",
        message: "What is your name?",
    }, {
        name: "authorEmail",
        message: "What is your email?",
    }, {
        name: "authorTwitter",
        message: "Your Twitter user name:"
    }];
    inquirer.prompt(prompts, function(answers) {
        for (var key in answers) {
            if (answers.hasOwnProperty(key)) {
                infoToRender[key] = answers[key];
            }
        }
        if (typeof callback === "function") {
            callback(null);
        }
    });
};
/**
 * Github related prompts.
 * @method github
 */
prompt.github = function(callback) {
    var prompts = [{
        name: "githubUserName",
        message: "Github username: ",
    }, {
        name: "githubPassword",
        type: 'password',
        message: "Github password: ",
    }, {
        name: "githubRepoName",
        message: "Give the new repository name to create (this will be site base-url)",
        default: "my-site"
    }];
    inquirer.prompt(prompts, function(answers) {
        for (var key in answers) {
            if (answers.hasOwnProperty(key)) {
                infoToRender[key] = answers[key];
            }
        }
        if (typeof callback === "function") {
            callback(null);
        }
    });
};
/**
 * Social sites related prompts.
 * @method social
 */
prompt.social = function(callback) {
    var prompts = [{
        name: "socialFacebook",
        message: "Facebook username"
    }, {
        name: "socialTwitter",
        message: "Twitter username"
    }, {
        name: "socialLinkedin",
        message: "Linkedin account full url"
    }, {
        name: "socialYoutube",
        message: "Youtube account full url"
    },{
        name: "socialGithub",
        message: "Github username/repository-name"
    }];
    inquirer.prompt(prompts, function(answers) {
        for (var key in answers) {
            if (answers.hasOwnProperty(key)) {
                infoToRender[key] = answers[key];
            }
        }
        if (typeof callback === "function") {
            callback(null);
        }
    });
};
prompt.blogOnly = function(callback) {
    var prompts = [{
        name: "paginate",
        message: "How many post you want on a page.",
        default : 5
    }];
    inquirer.prompt(prompts, function(answers) {
        for (var key in answers) {
            if (answers.hasOwnProperty(key)) {
                infoToRender[key] = answers[key];
            }
        }
        if (typeof callback === "function") {
            callback(null);
        }
    });
};
/**
 * Prompt to ask user for adding new post,page,layout, section or team member.
 * @method addPrompt
 */
prompt.addPrompt = function(callback) {
    var addList = ['post', 'page', 'team member', 'layout', 'section'];
    var prompts = [{
        name: 'name',
        type: 'list',
        message: 'What do you want to add?',
        choices: addList
    }];
    inquirer.prompt(prompts, function(answers) {
        switch (answers.name) {
            case 'post':
                add.post();
                break;
            case 'page':
                add.page();
                break;
            case 'team member':
                add.teamMember();
                break;
            case 'layout':
                add.layout();
                break;
            case 'section':
                add.section();
                break;
            default:
        }
        if (typeof callback === "function") {
            callback(null);
        }
    });
};
/**
 * Prompt to ask user for removing post,page,layout, section or team member.
 * @method removePrompt
 */
prompt.removePrompt = function(callback) {
    var removeList = ['post', 'page', 'team member', 'layout', 'section'];
    var prompts = [{
        name: 'name',
        type: 'list',
        message: 'What do you want to add?',
        choices: removeList
    }];
    inquirer.prompt(prompts, function(answers) {
        switch (answers.name) {
            case 'post':
                remove.post();
                break;
            case 'page':
                remove.page();
                break;
            case 'team member':
                remove.teamMember();
                break;
            case 'layout':
                remove.layout();
                break;
            case 'section':
                remove.section();
                break;
            default:
        }
        if (typeof callback === "function") {
            callback(null);
        }
    });
};