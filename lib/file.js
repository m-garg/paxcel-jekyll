var infoToRender = require("./infoToRender.js");
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var stream = require('stream')
var file = module.exports;

file.sourceRootPath = function sourceRootPath (){
  return path.resolve(__dirname, 'templates');
};
file.copyProject = function copyProject (callback){
  this.createRequiredDirectories();
  this.template("_includes/about.html", "_includes/about.html");
	this.template("_includes/clients.html", "_includes/clients.html");
	this.template("_includes/contact.html", "_includes/contact.html");
	this.template("_includes/footer.html", "_includes/footer.html");
	this.template("_includes/head.html", "_includes/head.html");
	this.template("_includes/header.html", "_includes/header.html");
	this.template("_includes/js.html", "_includes/js.html");
	this.template("_includes/modals.html", "_includes/modals.html");
	this.template("_includes/portfolio_grid.html", "_includes/portfolio_grid.html");
	this.template("_includes/services.html", "_includes/services.html");
	this.template("_includes/team.html", "_includes/team.html");
	this.template("_includes/css/agency.css", "_includes/css/agency.css");
	this.copy("_includes/css/bootstrap.min.css", "_includes/css/bootstrap.min.css");
	this.template("_layouts/style.css", "_layouts/style.css");
	this.template("_layouts/default.html", "_layouts/default.html");
	this.copyDirectory('_posts', '_posts');
	this.copyDirectory('_plugins', '_plugins');
	this.copyDirectory('css', 'css');
	this.copyDirectory('mail', 'mail');
	this.copyDirectory('img', 'img');
	this.copyDirectory('js', 'js');
	this.template("cname", "cname");
	this.template('_config.yml','_config.yml');
	this.copy('feed.xml','feed.xml');
	this.copy('style.css','style.css');
	this.template('index.html','index.html');
	this.copy('README.md','README.md');
  if(typeof callback  === "function"){
          callback(null);
  }
};

  
file.copy = function copy (src,dest){
 var source = this.createSourcePath(src);
 var destination = this.createDestinationPath(dest);
 console.log("copying file: "+src);
fs.createReadStream(source).pipe(fs.createWriteStream(destination));
};

file.template = function template (src,dest){
 var source = this.createSourcePath(src);
 var destination = this.createDestinationPath(dest);
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

file.copyDirectory = function copyDirectory(src,dest){
  var source = this.createSourcePath(src);
 var destination = this.createDestinationPath(dest);
 var ncp = require('ncp').ncp;
 
ncp.limit = 16;
 
ncp(source, destination, function (err) {
 if (err) {
   return console.error("error copying directory : " + src+" :" + err);
 }
 console.log('done copying directory : '+src);
});
};

file.createSourcePath = function createSourcePath(src){
    return path.resolve(file.sourceRootPath(), src);
};

file.createDestinationPath = function createDestinationPath(dest) {
    return path.resolve(process.cwd(), dest);
};

file.createRequiredDirectories = function createRequiredDirectories(){
  fs.mkdirSync(file.createDestinationPath("_includes"));
    fs.mkdirSync(file.createDestinationPath("_includes/css"));
  fs.mkdirSync(file.createDestinationPath("_layouts"));
};

file.getFilesOfDirectory = function name(directory) {
    return fs.readdirSync(file.createSourcePath(directory));
};
file.readFile = function readFile(dest) {
  return fs.readFileSync(file.createDestinationPath(dest));
};
file.writeFile = function readFile(dest,data) {
  return fs.writeFileSync(file.createDestinationPath(dest),data);
};
file.appendDataToFile = function appendDataToFile(dest,data) {
   fs.appendFileSync(file.createDestinationPath(dest), data);
};
file.deleteFile = function deleteFile(dest) {
  fs.unlink(file.createDestinationPath(dest), function (err) {
    if (err) {
      console.log("error deleting file");
      throw err
    };
  });
};
file.createPostFileName = function createPostFileName(fileName) {
  var date= new Date();
  var newFileName = fileName.replace(/\s+/g, '-').toLowerCase();
  return date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+'-'+newFileName+'.md';
};