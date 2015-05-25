/**
 * Various functions related to file handling.
 * @module base
 * @submodule file
 */
var infoToRender = require("./infoToRender.js");
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var stream = require('stream');

 /**
 * Various functions related to file handling.
 * @class file
 */
var file = module.exports;

/**
 * Copy files and folders from base template to create new website
 * @method copyWebsite
 */
file.copyWebsite = function(callback) {
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
    this.template('_config.yml', '_config.yml');
    this.copy('feed.xml', 'feed.xml');
    this.copy('style.css', 'style.css');
    this.template('index.html', 'index.html');
    this.copy('README.md', 'README.md');
    if (typeof callback === "function") {
        callback(null);
    }
};
/**
 * Create path of the base template. (Template that resides in the npm module)
 * @method sourceRootPath
 * @return {String} Source path of the base template.
 */
file.sourceRootPath = function() {
    return path.resolve(__dirname, 'templates');
};
/**
 * Copy file from source to destination.
 * @method copy
 * @param src {String} Source file path, relative to base template.
 * @param dest {String} Destination file path, relative to current directory
 */
file.copy = function(src, dest) {
    file.createDirectoriesIfNotExist(dest);
    var source = this.createSourcePath(src);
    var destination = this.createDestinationPath(dest);
    fs.createReadStream(source).pipe(fs.createWriteStream(destination));
};
/**
 * Render file from source and copy to the destination.
 * @method template
 * @param src {String} Source file path, relative to base template.
 * @param dest {String} Destination file path, relative to current directory
 */
file.template = function(src, dest) {
    file.createDirectoriesIfNotExist(dest);
    var source = this.createSourcePath(src);
    var destination = this.createDestinationPath(dest);
    console.log("templating file: " + src);
    var rendered;
    ejs.renderFile(source, infoToRender, function(err, result) {
        if (err) {
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
    /*wr.on("close", function(ex) {
        console.log("done writing");
    });*/
    readStream.pipe(wr);
};
/**
 * Copy Directory (including sub directories and files) from source to destination.
 * @method copyDirectory
 * @param src {String} Source directory path, relative to base template.
 * @param dest {String} Destination directory path, relative to current directory
 */
file.copyDirectory = function(src, dest) {
    var source = this.createSourcePath(src);
    var destination = this.createDestinationPath(dest);
    var ncp = require('ncp').ncp;
    ncp.limit = 16;
    ncp(source, destination, function(err) {
        if (err) {
            return console.error("error copying directory : " + src + " :" + err);
        }
        console.log('done copying directory : ' + src);
    });
};
/**
 * Create full source path from relative path.
 * @method createSourcePath
 * @param src {String} Source file/folder path, relative to base template.
 * @return {String} Full Source path.
 */
file.createSourcePath = function(src) {
    return path.resolve(file.sourceRootPath(), src);
};
/**
 * Create full destination path from relative path.
 * @method createDestinationPath
 * @param dest {String} Destination file/folder path, relative to current directory
 * @return {String} Full Destination path.
 */
file.createDestinationPath = function(dest) {
    if (!dest) {
        dest = "";
    }
    return path.resolve(process.cwd(), dest);
};
/**
 * Get list of files and folders of directory.
 * @method getFilesOfDirectory
 * @param directory {String} Destination folder path, relative to current directory
 */
file.getFilesOfDirectory = function(directory) {
    return fs.readdirSync(file.createDestinationPath(directory));
};
/**
 * Read a file.
 * @method readFile
 * @param dest {String} Destination file path, relative to current directory
 * @return {String} Content of the file.
 */
file.readFile = function(dest) {
    return fs.readFileSync(file.createDestinationPath(dest));
};
/**
 * Write a file (Overwrite the existing file)
 * @method writeFile
 * @param dest {String} Destination file path, relative to current directory
 * @param data {String} Data to write
 */
file.writeFile = function(dest, data) {
    fs.writeFileSync(file.createDestinationPath(dest), data);
};
/**
 * Append data at the end of a file.
 * @method appendDataToFile
 * @param dest {String} Destination file path, relative to current directory
 * @param data {String} Data to append
 */
file.appendDataToFile = function(dest, data) {
    fs.appendFileSync(file.createDestinationPath(dest), data);
};
/**
 * Delete file.
 * @method deleteFile
 * @param dest {String} Destination file path, relative to current directory
 */
file.deleteFile = function(dest) {
    fs.unlink(file.createDestinationPath(dest), function(err) {
        if (err) {
            console.log("error deleting file");
        }
    });
};
/**
 * Create post file name. Converts white spaces to hifens and append date in the starting.
 * @method createPostFileName
 * @param fileName {String} Post title.
 */
file.createPostFileName = function(fileName) {
    var date = new Date();
    var newFileName = fileName.replace(/\s+/g, '-').toLowerCase();
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '-' + newFileName + '.md';
};
/**
 * Check the path of a file, and create folders, if does not exist. For example: If input is "abc\xyz\file.js", the function will automatically create folders abc and xyz, if they does not exist.
 * @method createDirectoriesIfNotExist
 * @param dest {String} Destination file path, relative to current directory
 */
file.createDirectoriesIfNotExist = function(dest) {
    var folders = dest.split("/");
    if (folders.length === 1) {
        return;
    }
    var currentDirectory = "";
    for (var idx = 0; idx < folders.length - 1; idx++) {
        currentDirectory = currentDirectory + folders[idx] + '/';
        fs.mkdir(file.createDestinationPath(currentDirectory), function(err) {});
    }
};
/**
 * Check if the directory is empty or not.
 * @method isDirectoryEmpty
 * @param dest {String} Destination folder path, relative to current directory
 * @return {Boolean} true if directory is empty, else false.
 */
file.isDirectoryEmpty = function(dest) {
    var items;
    try {
        items = fs.readdirSync(file.createDestinationPath(dest));
    } catch (err) {
        //console.log(err);
        return false;
    }
    if (items.length === 0)
        return true;
    else
        return false;
};
/**
 * Check if the base template already exist or not.
 * @method baseTemplateExist
 * @return {Boolean} true if base template already exist, else false.
 */
file.baseTemplateExist = function() {
    try {
        fs.mkdirSync(file.sourceRootPath());
    } catch (err) {
        if (err.code == 'EEXIST')
            return true;
    }
    return false;
};
/**
 * Check if the file already exist or not.
 * @method fileExist
 * @param dest {String} Destination file path, relative to current directory
 * @return {Boolean} true if file already exist, else false.
 */
file.fileExist = function(dest) {
    try {
        fs.readFileSync(file.createDestinationPath(dest));
    } catch (err) {
        return false;
    }
    return true;
};