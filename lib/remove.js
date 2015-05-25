var inquirer = require("inquirer");
var file = require("./file.js");
var chalk = require("chalk");
var yaml = require("js-yaml");
var remove = module.exports;
var _ = require("lodash");

remove.layout = function(callback) {
    var layoutList;
    try {
        layoutList = file.getFilesOfDirectory("_layouts");
    } catch (error) {
        console.log(chalk.red("Cannot find the _layouts directory."));
        console.log(chalk.yellow("Make sure that you are in the right project directory."));
        process.exit(1);
    }
    var prompts = [{
        name: 'layoutName',
        type: 'list',
        message: 'Choose layout?',
        choices: layoutList
    }];
    inquirer.prompt(prompts, function(answers) {
        var filepath = '_layouts/' + answers.layoutName;
        try {
            file.deleteFile(filepath);
        } catch (error) {
            console.log(chalk.red("Error deleting layout."));
            process.exit(1);
        }

        if (typeof callback === "function") {
            callback(null);
        }
    });
};
remove.section = function(callback) {
    var sectionList;
    try {
        sectionList = file.getFilesOfDirectory("_includes");
    } catch (error) {
        console.log(chalk.red("Cannot find the _includes directory."));
        console.log(chalk.yellow("Make sure that you are in the right project directory."));
        process.exit(1);
    }
    var prompts = [{
        name: 'sectionName',
        type: 'list',
        message: 'Choose section?',
        choices: sectionList
    }];
    inquirer.prompt(prompts, function(answers) {
        var filepath = '_includes/' + answers.sectionName;
        try {
            file.deleteFile(filepath);
        } catch (error) {
            console.log(chalk.red("Error deleting section."));
            process.exit(1);
        }

        if (typeof callback === "function") {
            callback(null);
        }
    });
};

remove.post = function(callback) {
    var postList;
    try {
        postList = file.getFilesOfDirectory("_posts");
    } catch (error) {
        console.log(chalk.red("Cannot find the available posts."));
        console.log(chalk.yellow("Make sure that you are in the right project directory."));
        process.exit(1);
    }
    var prompts = [{
        name: 'postName',
        type: 'list',
        message: 'Choose post?',
        choices: postList
    }];
    inquirer.prompt(prompts, function(answers) {
        var filepath = '_posts/' + answers.postName;
        try {
            file.deleteFile(filepath);
        } catch (error) {
            console.log(chalk.red("Error deleting post."));
            process.exit(1);
        }

        if (typeof callback === "function") {
            callback(null);
        }
    });
};

remove.teamMember = function(callback) {
    var team;
    try {
        team = yaml.safeLoad(file.readFile("_data/team.yml"));
    } catch (error) {
        console.log(chalk.red("Error deleting team member."));
        console.log(chalk.yellow("Make sure that you are in the right project directory."));
        process.exit(1);
    }
    
    var teamList = team.people.map(function(member) {
        return member.name;
    });
    var prompts = [{
        name: 'memberName',
        type: 'list',
        message: 'Choose member?',
        choices: teamList
    }];
    inquirer.prompt(prompts, function(answers) {
        var index = _.findIndex(team.people, function(member) {
            return member.name == answers.memberName;
        });
        team.people.splice(index, 1);
        var teamYAML = yaml.safeDump(team);
        file.writeFile("_data/team.yml", teamYAML);
        console.log(chalk.green("Team member " + answers.memberName + " deleted successfully"));
        if (typeof callback === "function") {
            callback(null);
        }
    });
};
remove.page = function(callback) {
    var prompts = [{
        name: 'pageUrl',
        message: 'Enter url of the page?(without html)\nExample: For www.yourdomain.com/about --> about'
    }];
    inquirer.prompt(prompts, function(answers) {
        var filepath = answers.pageUrl + '/index.html';
        try {
            file.deleteFile(filepath);
        } catch (error) {
            console.log(chalk.red("Error deleting page."));
            process.exit(1);
        }
        if (typeof callback === "function") {
            callback(null);
        }
    });
};