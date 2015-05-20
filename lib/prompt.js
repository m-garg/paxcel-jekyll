//var infoToRender ={};
var inquirer = require("inquirer");
var infoToRender = require("./infoToRender.js");
var file = require("./file.js");
var chalk = require("chalk");
var yaml = require("js-yaml");
var prompt = module.exports;

prompt.all = function all(callback){
	  var prompts = [{
      name: "projectName",
      message: "What is the name of your project?"
    }, {
      name: "projectDescription",
      message: "Describe your project for me:"
    }, {
      name: "projectTagline",
      message: "What is the tag line for your project?"
    },{
  		name: "projectKeywords",
  		message: "Give the keywords related to your website"
  	},{
  		name: "cname",
  		message : "If you want to use custom domain for this website, enter it ",
  		default:""
  	},{
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
    },{
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
    },{
      name: "githubConfig",
	    confirm : "confirm",
      message: "Is this the first time you are using git on this system?(yes/no)",
	    default: "no"
    }];
	inquirer.prompt(prompts, function( answers ) {
      for (var key in answers) {
        if (answers.hasOwnProperty(key)) {
          console.log(key + " -> " + answers[key]);
          infoToRender[key] = answers[key];
        }
      }
      if(typeof callback  === "function"){
          callback(null);
      }
    });
};

prompt.project = function projectPrompting(callback) {
  console.log(infoToRender);

  var prompts = [{
      name: "projectName",
      message: "What is the name of your project?"
    }, {
      name: "projectDescription",
      message: "Describe your project for me:"
    }, {
      name: "projectTagline",
      message: "What is the tag line for your project?"
    },{
  		name: "projectKeywords",
  		message: "Give the keywords related to your website"
  	},{
  		name: "cname",
  		message : "If you want to use custom domain for this website, enter it ",
  		default:""
  	}];
	inquirer.prompt(prompts, function( answers ) {
      for (var key in answers) {
        if (answers.hasOwnProperty(key)) {
          console.log(key + " -> " + answers[key]);
          infoToRender[key] = answers[key];
        }
      }
      if(typeof callback  === "function"){
      callback(null);
      }
    });
};
prompt.author = function authorPrompting(callback) {
  console.log("inside author prompt");
   console.log("infoToRender"+  infoToRender.toString());
	  var prompts = [{
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
    }];
	inquirer.prompt(prompts, function( answers ) {
      for (var key in answers) {
        if (answers.hasOwnProperty(key)) {
          console.log(key + " -> " + answers[key]);
          infoToRender[key] = answers[key];
        }
      }
      if(typeof callback  === "function"){
          callback(null);
      }
    });
};
prompt.github = function githubPrompting(callback){
	  var prompts = [{
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
    },{
      name: "githubConfig",
	    confirm : "confirm",
      message: "Is this the first time you are using git on this system?(yes/no)",
	    default: "no"
    }];
	inquirer.prompt(prompts, function( answers ) {
      for (var key in answers) {
        if (answers.hasOwnProperty(key)) {
          console.log(key + " -> " + answers[key]);
          infoToRender[key] = answers[key];
        }
      }
      if(typeof callback  === "function"){
          callback(null);
      }
    });
};

prompt.layouts = function layoutPrompting() {
var layoutList = file.getFilesOfDirectory("_layouts");
inquirer.prompt([{
      name: 'layout',
      type: 'list',
      message: 'Choose layout?',
      choices: layoutList
    }], function (answers) {
          file.copy("_layouts/"+answers.layout,"_layouts/"+answers.layout);
 });
};
prompt.includes = function layoutPrompting() {
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
};
prompt.addLayout = function addLayout() {
  var prompts = [{
      name: "layoutName",
      message: "Name of the layout",
    }, {
      name: "teamMemberPosition",
      message: "Position of team member:",
    }];
};
prompt.addSection = function addLayout() {
  var prompts = [{
      name: "sectionName",
      message: "Name of the section",
    }, {
      name: "teamMemberPosition",
      message: "Position of team member:",
    }];
};
prompt.addTeamMember = function addTeamMember(callback) {
  var prompts = [{
      name: "teamMemberName",
      message: "Name of team member",
    }, {
      name: "teamMemberPosition",
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
      var data = "- name: "+member.teamMemberName+"\n  pic: 1\n  position: "+member.teamMemberPosition+"\n  social:\n    - title: twitter\n      url: #\n    - title: facebook\n      url: #\n    - title: linkedin\n      url: #";
      file.appendDataToFile("_data/team.yml",data);

      if(typeof callback  === "function"){
          callback(null);
      }
    });
};

prompt.updateTeamMember = function updateTeamMember(callback) {
  var prompts = [{
      name: "teamMemberName",
      message: "Name of team member",
    }, {
      name: "teamMemberPosition",
      message: "Position of team member:",
    },{
      name : "teamMemberLocation",
      message : "Location of team member"
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
       if(team.teamMemberLocation >= team.people.length){
         console.log("No member found at the location specified. Please enter valid location");
       }
       else{
         team.people[team.teamMemberLocation].name = member.teamMemberName;
         team.people[team.teamMemberLocation].position = member.teamMemberPosition;
         console.log(team);
         var data = yaml.safeDump(team);
         file.writeFile("_data/team.yml",data);
      }
      if(typeof callback  === "function"){
          callback(null);
      }
    });
};
