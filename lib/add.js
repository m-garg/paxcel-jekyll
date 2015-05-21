var inquirer = require("inquirer");
var infoToRender = require("./infoToRender.js");
var file = require("./file.js");
var chalk = require("chalk");
var yaml = require("js-yaml");
var add = module.exports;

add.layout = function (callback) {
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

add.section = function (callback) {
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

add.teamMember = function (callback) {
  var prompts = [{
      name: "name",
      message: "Name of team member"
    }, {
      name: "position",
      message: "Position of team member:"
    }];
	inquirer.prompt(prompts, function( answers ) {
    var member={};
      for (var key in answers) {
        if (answers.hasOwnProperty(key)) {
          console.log(key + " -> " + answers[key]);
          member[key] = answers[key];
        }
      }
      var team = yaml.safeLoad(file.readFile("_data/team.yml"));
      console.log("team \n %o:",team.people[0].social);
      team.people.push({ 
        name: member.name,
        pic: member.name,
        position: member.position,
        social:[{
          title : 'twitter',
          url : '#' 
          },{
          title : 'facebook',
          url : '#' 
          },{
          title : 'linkedin',
          url : '#' 
          }
        ]});
      var teamYAML = yaml.safeDump (team);
      file.writeFile("_data/team.yml",teamYAML);
      console.log(chalk.green("Team member "+member.name+" added successfully"));
      console.log(chalk.yellow("Add image named '"+member.name+"' to the img folder."));
      if(typeof callback  === "function"){
          callback(null);
      }
    });
};

add.post = function (callback) {
  var layoutList = file.getFilesOfDirectory("_layouts");
    var prompts = [{
      name: 'layout',
      type: 'list',
      message: 'Choose layout?',
      choices: layoutList
    }, {
      name: "title",
      message: "Post Title"
    }];
    inquirer.prompt(prompts, function( answers ) {
      var layout = answers.layout.replace(".html","");
      var fileName = file.createPostFileName(answers.title);
      var post = '---\nlayout:     '+layout+'\ntitle:      '+answers.title+'\n---\n';
      if(!file.fileExist('_posts/'+fileName,post)){
        file.writeFile('_posts/'+fileName,post);
      }
      else{
        console.log(chalk.red("Post was not created. Reason: Post already exist"));
      }
      if(typeof callback  === "function"){
          callback(null);
      }
    });
};

add.page = function (callback) {
  var layoutList = file.getFilesOfDirectory("_layouts");
    var prompts = [{
      name: 'layout',
      type: 'list',
      message: 'Choose layout?',
      choices: layoutList
    }, {
      name: "title",
      message: "Page Title"
    },{
      name : "url",
      message : "url for the page(without .html)\nExample: For www.yourdomain.com/about --> about"
    }];
    inquirer.prompt(prompts, function( answers ) {
      var layout = answers.layout.replace(".html","");
      var page = '---\nlayout:     '+layout+'\ntitle:      '+answers.title+'\n---\n';
      if(!file.fileExist(answers.url+'/index.html')){
        file.createDirectoriesIfNotExist(answers.url+'/');
        file.writeFile(answers.url+'/index.html',page);
      }
      else{
        console.log(chalk.red("Page was not created. Reason: Page already exist"));
      }
      if(typeof callback  === "function"){
          callback(null);
      }
    });
};