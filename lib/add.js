/**
 * Various functions to add new post, page, layout, section or team member.
 * @module base
 * @submodule add
 */
var inquirer = require("inquirer");
var file = require("./file.js");
var chalk = require("chalk");
var yaml = require("js-yaml");
/**
 * Various functions to add new post, page, layout, section or team member.
 * @class add
 */
var add = module.exports;
/**
 * Add new layout.
 * @method layout
 */
add.layout = function(callback) {
    var prompts = [{
        name: "layoutName",
        message: "Name of the layout"
    }];
    inquirer.prompt(prompts, function(answers) {
        var filepath = '_layouts/' + answers.layoutName + '.html';
        try{
            file.writeFile(filepath, '');
        }catch(error){
            console.log(chalk.red("Error creating new layout."));
            console.log(chalk.yellow("Make sure that you are in the right project directory."));
            process.exit(1);
        }
        if (typeof callback === "function") {
            callback(null);
        }
    });
};
/**
 * Add new section.
 * @method section
 */
add.section = function(callback) {
    var prompts = [{
        name: "sectionName",
        message: "Name of the section"
    }];
    inquirer.prompt(prompts, function(answers) {
        var filepath = '_includes/' + answers.sectionName + '.html';
        try {
            file.writeFile(filepath, '');
        } catch (error) {
            console.log(chalk.red("Error creating new section."));
            console.log(chalk.yellow("Make sure that you are in the right project directory."));
            process.exit(1);
        }
        
        if (typeof callback === "function") {
            callback(null);
        }
    });
};
/**
 * Add new team member.
 * @method teamMember
 */
add.teamMember = function(callback) {
    var prompts = [{
        name: "name",
        message: "Name of team member"
    }, {
        name: "position",
        message: "Position of team member:"
    }];
    inquirer.prompt(prompts, function(answers) {
        var member = {};
        for (var key in answers) {
            if (answers.hasOwnProperty(key)) {
                console.log(key + " -> " + answers[key]);
                member[key] = answers[key];
            }
        }
        var team;
        try {
            team = yaml.safeLoad(file.readFile("_data/team.yml"));
        } catch (error) {
            console.log(chalk.red("Error adding new team member."));
            console.log(chalk.yellow("Make sure that you are in the right project directory."));
            process.exit(1);
        }
        
        team.people.push({
            name: member.name,
            pic: member.name,
            position: member.position,
            social: [{
                title: 'twitter',
                url: '#'
            }, {
                title: 'facebook',
                url: '#'
            }, {
                title: 'linkedin',
                url: '#'
            }]
        });
        var teamYAML = yaml.safeDump(team);
        file.writeFile("_data/team.yml", teamYAML);
        console.log(chalk.green("Team member " + member.name + " added successfully"));
        console.log(chalk.yellow("Add image named '" + member.name + "' to the img folder."));
        if (typeof callback === "function") {
            callback(null);
        }
    });
};
/**
 * Add new post.
 * @method post
 */
add.post = function(callback) {
    var layoutList;
    try {
        layoutList = file.getFilesOfDirectory("_layouts");
    } catch (error) {
        console.log(chalk.red("Cannot find the layouts."));
        console.log(chalk.yellow("Make sure that you are in the right project directory."));
        process.exit(1);
    }
    
    var prompts = [{
        name: 'layout',
        type: 'list',
        message: 'Choose layout?',
        choices: layoutList
    }, {
        name: "title",
        message: "Post Title"
    }];
    inquirer.prompt(prompts, function(answers) {
        var layout = answers.layout.replace(".html", "");
        var fileName = file.createPostFileName(answers.title);
        var post = '---\nlayout:     ' + layout + '\ntitle:      ' + answers.title + '\n---\n';
        try {
            if (!file.fileExist('_posts/' + fileName, post)) {
                file.writeFile('_posts/' + fileName, post);
            } else {
                console.log(chalk.red("Post was not created. Reason: Post already exist"));
            }
        } catch (error) {
            console.log(chalk.red("Cannot create new post."));
            console.log(chalk.yellow("Make sure that you are in the right project directory."));
            process.exit(1);
        }
        
        if (typeof callback === "function") {
            callback(null);
        }
    });
};
/**
 * Add new page.
 * @method page
 */
add.page = function(callback) {
    var layoutList;
    try {
        layoutList = file.getFilesOfDirectory("_layouts");
    } catch (error) {
        console.log(chalk.red("Cannot find the layouts."));
        console.log(chalk.yellow("Make sure that you are in the right project directory."));
        process.exit(1);
    }
    var prompts = [{
        name: 'layout',
        type: 'list',
        message: 'Choose layout?',
        choices: layoutList
    }, {
        name: "title",
        message: "Page Title"
    }, {
        name: "url",
        message: "url for the page(without .html)\nExample: For www.yourdomain.com/about --> about"
    }];
    inquirer.prompt(prompts, function(answers) {
        var layout = answers.layout.replace(".html", "");
        var page = '---\nlayout:     ' + layout + '\ntitle:      ' + answers.title + '\n---\n';
        try {
            if (!file.fileExist(answers.url + '/index.html')) {
                file.createDirectoriesIfNotExist(answers.url + '/');
                file.writeFile(answers.url + '/index.html', page);
            } else {
                console.log(chalk.red("Page was not created. Reason: Page already exist"));
            }
        } catch (error) {
            console.log(chalk.red("Cannot create new page."));
            console.log(chalk.yellow("Make sure that you are in the right project directory."));
            process.exit(1);
        }
        if (typeof callback === "function") {
            callback(null);
        }
    });
};