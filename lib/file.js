var infoToRender = require("./infoToRender.js");
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var stream = require('stream')
var file = module.exports;

file.sourceRootPath = function (){
  return path.resolve(__dirname, 'templates');
};

file.copyWebsite = function (callback){
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

  
file.copy = function (src,dest){
 file.createDirectoriesIfNotExist(dest);
 var source = this.createSourcePath(src);
 var destination = this.createDestinationPath(dest);
 console.log("copying file: "+src);
fs.createReadStream(source).pipe(fs.createWriteStream(destination));
};

file.template = function (src,dest){
 file.createDirectoriesIfNotExist(dest);
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

file.copyDirectory = function (src,dest){
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

file.createSourcePath = function (src){
    return path.resolve(file.sourceRootPath(), src);
};

file.createDestinationPath = function (dest) {
  if(!dest){
    dest = "";
  }
  return path.resolve(process.cwd(), dest);
};

file.getFilesOfDirectory = function (directory) {
    return fs.readdirSync(file.createDestinationPath(directory));
};

file.readFile = function (dest) {
  return fs.readFileSync(file.createDestinationPath(dest));
};

file.writeFile = function (dest,data) {
  fs.writeFileSync(file.createDestinationPath(dest),data);
};

file.appendDataToFile = function (dest,data) {
   fs.appendFileSync(file.createDestinationPath(dest), data);
};

file.deleteFile = function (dest) {
  fs.unlink(file.createDestinationPath(dest), function (err) {
    if (err) {
      console.log("error deleting file"+err);
    };
  });
};

file.createPostFileName = function (fileName) {
  var date= new Date();
  var newFileName = fileName.replace(/\s+/g, '-').toLowerCase();
  return date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+'-'+newFileName+'.md';
};

file.createDirectoriesIfNotExist = function (dest) {
  var folders = dest.split("/");
  if(folders.length === 1){
    return;
  }
  var currentDirectory = "";
  for (var idx=0;idx<folders.length-1;idx++){
    currentDirectory= currentDirectory + folders[idx] + '/';
    fs.mkdir(file.createDestinationPath(currentDirectory),function (err) {
    });
  }
};

file.isDirectoryEmpty = function (dest) {
        try{
          var items = fs.readdirSync(file.createDestinationPath(dest));
        }
        catch(err){
          //console.log(err);
          return false;
        }
        if(items.length === 0)
          return true;
        else
          return false;
};

file.alreadyCloned = function () {
  try{
    fs.mkdirSync(file.sourceRootPath());
  }catch(err){
    if (err.code == 'EEXIST') 
      return true;
    }
    return false;
};

file.fileExist = function (dest) {
        try{
          fs.readFileSync(file.createDestinationPath(dest));
        }
        catch(err){
          return false;
        }
          return true;  
};