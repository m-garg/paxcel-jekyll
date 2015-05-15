var _ = require('lodash');
var inquirer = require("inquirer");
var path = require('path');
var stream = require('stream');
var ejs = require('ejs');
var fs = require('fs');
var async = require('async');
var execSync = require('child_process').execSync;
var GitHubApi = require('github');
var chalk = require('chalk');
var infoToRender= {};
var git={};
var githubOptions = {
  version: '3.0.0'
};
var github = new GitHubApi(githubOptions);
//_.extend(Base.prototype,require('./actions/input'));

var prompt = function prompt(){
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
          infoToRender[key] = answers[key]
        }
      }
  //copyfiles
  copyProject();
});

};


var sourceRootPath = function sourceRootPath (){
  return path.resolve(__dirname, 'templates');
};

var copyProject = function copyProject (){
  createRequiredDirectories();
  template("_includes/about.html", "_includes/about.html");
	template("_includes/clients.html", "_includes/clients.html");
	template("_includes/contact.html", "_includes/contact.html");
	template("_includes/footer.html", "_includes/footer.html");
	template("_includes/head.html", "_includes/head.html");
	template("_includes/header.html", "_includes/header.html");
	template("_includes/js.html", "_includes/js.html");
	template("_includes/modals.html", "_includes/modals.html");
	template("_includes/portfolio_grid.html", "_includes/portfolio_grid.html");
	template("_includes/services.html", "_includes/services.html");
	template("_includes/team.html", "_includes/team.html");
	template("_includes/css/agency.css", "_includes/css/agency.css");
	copy("_includes/css/bootstrap.min.css", "_includes/css/bootstrap.min.css");
	template("_layouts/style.css", "_layouts/style.css");
	template("_layouts/default.html", "_layouts/default.html");
	copyDirectory('_posts', '_posts');
	copyDirectory('_plugins', '_plugins');
	copyDirectory('css', 'css');
	copyDirectory('mail', 'mail');
	copyDirectory('img', 'img');
	copyDirectory('js', 'js');
	template("cname", "cname");
	template('_config.yml','_config.yml');
	copy('feed.xml','feed.xml');
	copy('style.css','style.css');
	template('index.html','index.html');
	copy('README.md','README.md');
  pushToGit();
};

  
var copy = function copy (src,dest){
 var source = createSourcePath(src);
 var destination = createDestinationPath(dest);
 console.log("copying file: "+src);
fs.createReadStream(source).pipe(fs.createWriteStream(destination));
};

var template = function template (src,dest){
 var source = createSourcePath(src);
 var destination = createDestinationPath(dest);
  console.log("templating file: "+src);
 var rendered ;
 ejs.renderFile(source,infoToRender,function(err,result){
   if(err){
     console.log(err);
   }
      rendered = result;
 });
 var readStream = new stream.Readable();

 readStream.push(rendered);
 readStream.push(null);

  var wr = fs.createWriteStream(destination);
  wr.on("error", function(err) {
    console.log(err);
  });
  wr.on("close", function(ex) {
    console.log("done writing");
  });
  readStream.pipe(wr);
};

var copyDirectory = function copyDirectory(src,dest){
  var source = createSourcePath(src);
 var destination = createDestinationPath(dest);
 var ncp = require('ncp').ncp;
 
ncp.limit = 16;
 
ncp(source, destination, function (err) {
 if (err) {
   return console.error("error copying directory : " + src+" :" + err);
 }
 console.log('done copying directory : '+src);
});
};

var createSourcePath = function createSourcePath(src){
    var filepath = path.resolve(sourceRootPath(), src);
    return filepath;
};
var createDestinationPath = function createDestinationPath(dest) {
    var filepath = path.resolve(process.cwd(), dest);
    return filepath;
};
var createRequiredDirectories = function createRequiredDirectories(){
  fs.mkdirSync(createDestinationPath("_includes"));
    fs.mkdirSync(createDestinationPath("_includes/css"));
  fs.mkdirSync(createDestinationPath("_layouts"));
};

var pushToGit = function pushToGit(){
  githubAuth(infoToRender.githubUserName,infoToRender.githubPassword);
		github.repos.create({
		name: infoToRender.githubRepoName
},function(err,res){
	if (err){
		console.log(chalk.red("\nError creating new repository : "+err));
		if(err.message == "Bad credentials"){
			console.log(chalk.red("Either username or password is incorrect."));
		}
		else if(err.message == "Validation Failed" ){
			console.log(chalk.red("Repository already exists!\nPlease use a different repository name."));
		}
		process.exit(1);
	}
	else{
		console.log(chalk.green("\nNew repository created: "+infoToRender.githubRepoName));
	}
	execSync('git init'); 
	execSync('git config core.autocrlf true');
    execSync('git add .');
    execSync('git commit -m "Initial_commit"');
    execSync('git remote add origin https://github.com/'+infoToRender.githubUserName+'/'+infoToRender.githubRepoName+'.git');
	execSync('git branch gh-pages');
	console.log(chalk.yellow("\nPlease enter your Github username and password again."));
	execSync('git push origin gh-pages');
	console.log(chalk.green("\nEverything done : You site is now live on "));
	console.log(chalk.yellow(infoToRender.githubUserName + ".github.io/" + infoToRender.githubRepoName));

});
};


var githubAuth = function githubAuth(username,password){
	github.authenticate({
		type: "basic",
		username: username,
		password: password
});
};
var check = function check (){

};
exports.check =check;
exports.prompt =prompt;
exports.copy =copy;
