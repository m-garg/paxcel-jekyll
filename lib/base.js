var _ = require('lodash');
var inquirer = require("inquirer");
var path = require('path');
var stream = require('stream');
var ejs = require('ejs');
var fs = require('fs');
var async = require('async');
exports.Base  = function () {
		console.log("hey");	
};

//_.extend(Base.prototype,require('./actions/input'));

exports.prompt = function(){
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
      console.log(answers);

      this.projectName = answers.projectName;
      this.projectDescription = answers.projectDescription;
      this.cname = answers.cname;
});

};

exports.sourceRootPath = function(){
  return path.resolve(__dirname, 'templates');
};

exports.copyFiles = function(){

 var source = path.resolve(this.sourceRootPath(), 'cname');
 var destination = path.resolve(process.cwd(), 'cname');
 console.log(source+" -> "+destination);
 var obj = {'cname': this.cname, 'projectName' : this.projectName , 'projectDescription' : this.projectDescription };
 var rendered ;
 ejs.renderFile(source,obj,function(err,result){
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
    console.log("done");
  });
  readStream.pipe(wr);
};

exports.copy = function (){
  async.series([
    this.prompt(),
    this.copyFiles()
]);

};