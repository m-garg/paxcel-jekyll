var inquirer = require("inquirer");
var infoToRender = require("./infoToRender.js");
var file = require("./file.js");
var chalk = require("chalk");
var yaml = require("js-yaml");
var add = module.exports;

add.layout = function addLayout(callback) {
  var prompts = [{
      name: "layoutName",
      message: "Name of the layout"
    }];
  inquirer.prompt(prompts, function( answers ) {
    var filepath = '_layouts/'+answers['layoutName']+'.html';
      file.writeFile(filepath,'');
      if(typeof callback  === "function"){
          callback(null);
      }
    });
};
add.section = function addLayout(callback) {
    var prompts = [{
      name: "sectionName",
      message: "Name of the section"
    }];
  inquirer.prompt(prompts, function( answers ) {
    var filepath = '_includes/'+answers['sectionName']+'.html';
      file.writeFile(filepath,'');
      if(typeof callback  === "function"){
          callback(null);
      }
    });
};
add.teamMember = function addTeamMember(callback) {
  var prompts = [{
      name: "name",
      message: "Name of team member",
    }, {
      name: "position",
      message: "Position of team member:",
    }];
	inquirer.prompt(prompts, function( answers ) {
    var member={};
      for (var key in answers) {
        if (answers.hasOwnProperty(key)) {
          console.log(key + " -> " + answers[key]);
          member[key] = answers[key];
        }
      }
      var data = "- name: "+member.name+"\n  pic: 1\n  position: "+member.position+"\n  social:\n    - title: twitter\n      url: #\n    - title: facebook\n      url: #\n    - title: linkedin\n      url: #";
      file.appendDataToFile("_data/team.yml",data);

      if(typeof callback  === "function"){
          callback(null);
      }
    });
};
add.post = function addPost(callback) {
  var layoutList = file.getFilesOfDirectory("_layouts");
    var prompts = [{
      name: 'layout',
      type: 'list',
      message: 'Choose layout?',
      choices: layoutList
    }, {
      name: "title",
      message: "Post Title",
    }];
    inquirer.prompt(prompts, function( answers ) {
      var fileName = file.createPostFileName(answers.title);
      var post = '---\nlayout:     '+answers.layout+'\ntitle:      '+answers.title+'\n---\n';
      file.writeFile('_posts/'+fileName,post);
      if(typeof callback  === "function"){
          callback(null);
      }
    });
};

/*
add.layout = function addlayout() {
var layoutList = file.getFilesOfDirectory("_layouts");
inquirer.prompt([{
      name: 'layout',
      type: 'list',
      message: 'Choose layout?',
      choices: layoutList
    }], function (answers) {
          file.copy("_layouts/"+answers.layout,"_layouts/"+answers.layout);
 });
};*/
/*
add.includes = function layoutPrompting() {
var includeFilesList = file.getFilesOfDirectory("_includes");
inquirer.prompt([{
      name: 'include',
      type: 'list',
      message: 'Choose file to include.',
      choices: includeFilesList
    }], function (answers) {
          file.copy("_includes/"+answers.include,"_includes/"+answers.include);
          console.log(chalk.yellow("include the following line in the layout where you want to add this file:\n")+chalk.green("{% include "+ answers.include +" %})"));
 });
};*/
