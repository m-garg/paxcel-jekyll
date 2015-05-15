var copyFile = function copyFile (){

 var source = path.resolve(sourceRootPath(), 'cname');
 var destination = path.resolve(process.cwd(), 'cname');
 console.log(source+" -> "+destination);
 console.log("inside: "+infoToRender);
 var rendered ;
 ejs.renderFile(source,infoToRender,function(err,result){
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
