var inquirer = require("inquirer");
var infoToRender = require("./infoToRender.js");
var file = require("./file.js");
var chalk = require("chalk");
var yaml = require("js-yaml");
var remove = module.exports;
var _ = require("lodash");

remove.layout = function (callback) {
  var layoutList = file.getFilesOfDirectory("_layouts");
  var prompts = [{
      name: 'layoutName',
      type: 'list',
      message: 'Choose layout?',
      choices: layoutList
    }];
    inquirer.prompt(prompts, function( answers ) {
      var filepath = '_layouts/'+answers['layoutName'];
      file.deleteFile(filepath);

      if(typeof callback  === "function"){
          callback(null);
      }
    });
};
remove.section = function (callback) {
  var sectionList = file.getFilesOfDirectory("_includes");
  var prompts = [{
      name: 'sectionName',
      type: 'list',
      message: 'Choose section?',
      choices: sectionList
    }];
    inquirer.prompt(prompts, function( answers ) {
      var filepath = '_includes/'+answers['sectionName'];
      file.deleteFile(filepath);

      if(typeof callback  === "function"){
          callback(null);
      }
    });
};

remove.post = function (callback) {
  var postList = file.getFilesOfDirectory("_posts");
  var prompts = [{
      name: 'postName',
      type: 'list',
      message: 'Choose post?',
      choices: postList
    }];
    inquirer.prompt(prompts, function( answers ) {
      var filepath = '_posts/'+answers['postName'];
      file.deleteFile(filepath);

      if(typeof callback  === "function"){
          callback(null);
      }
    });
};

remove.teamMember = function (callback) {
   var team = yaml.safeLoad(file.readFile("_data/team.yml"));
   var teamList = team.people.map(function(member) {
      return member['name'];
   });
   var prompts = [{
      name: 'memberName',
      type: 'list',
      message: 'Choose member?',
      choices: teamList
    }];
	inquirer.prompt(prompts, function( answers ) {
      var index = _.findIndex(team.people, function(member) {
            return member.name == answers.memberName;
      });
      team.people.splice(index, 1);
      var teamYAML = yaml.safeDump (team);
      file.writeFile("_data/team.yml",teamYAML);
      console.log(chalk.green("Team member "+answers.memberName+" deleted successfully"));
      if(typeof callback  === "function"){
          callback(null);
      }
    });
};
remove.page = function (callback) {
  var prompts = [{
      name: 'pageUrl',
      message: 'Enter url of the page?(without html)\nExample: For www.yourdomain.com/about --> about'
    }];
    inquirer.prompt(prompts, function( answers ) {
      var filepath = answers.pageUrl+'/index.html';
      file.deleteFile(filepath);
      if(typeof callback  === "function"){
          callback(null);
      }
    });
};