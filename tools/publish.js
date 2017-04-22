var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');


var server = http.createServer(function(req, res) {

    var page = url.parse(req.url).pathname;
    var params = querystring.parse(url.parse(req.url).query);

    if (page == '/') {
    	page = './index.html';
    }
    else {
    	page = '.' + page;
    }

  fs.readFile(page, function(err, data) {
    if (err) {
      res.writeHead(500);
    }
    else {
      res.writeHead(200, { 'Content-Type': 'text/html'});
      res.end(data);
    }
  });
});

server.listen(8080);