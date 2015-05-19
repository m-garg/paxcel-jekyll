//var infoToRender ={};
var inquirer = require("inquirer");
var infoToRender = require("./infoToRender.js");
var prompt = module.exports;
//var prompt = {};
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
     console.log("infoToRender"+  infoToRender.toString());
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

//module.exports = prompt;