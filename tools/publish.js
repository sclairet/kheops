
var http = require('http');
var fs = require('fs');
var url = require('url');
var mime = require('mime-types');
var path = require('path');

if (process.argv.length > 2) {

  var web = path.resolve(process.argv[2]);

  var server = http.createServer(function(req, res) {

    var page = url.parse(req.url).pathname;

    if (page == '/') {
      page = path.resolve(web, './index.html');
    }
    else {
      page = path.resolve(web, './' + page);
    }

    fs.readFile(page, function(err, data) {
      if (err) {
        res.writeHead(500);
      }
      else {
        var mime_type = mime.lookup(page);
        if (!mime_type) {
          mime_type = 'text/plain';
        }
        res.writeHead(200, {'Content-Type': mime_type});
        res.end(data);
      }
    });
  });

  server.listen(8011);
}
else {
  console.error('- missing web folder argument');
}

