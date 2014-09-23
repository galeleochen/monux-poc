var logmore = require('logmore');
logmore.use(require('logmore-console')());
var logger = logmore('monux');
logmore.enable('monux', 'info');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var nunjucks = require('nunjucks');
nunjucks.configure('web', {
  autoescape: true,
  express: app
});

app.use(express.static(__dirname + '/web'));

app.get('/', function (req, res) {
  res.render('index.html');
});

server.listen(1337);
logger.info('Server running at *:1337');
