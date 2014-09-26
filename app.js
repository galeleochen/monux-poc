var _ = require('lodash');


var logmore = require('logmore');
logmore.use(require('logmore-console')());
var logger = logmore('monux');
logmore.enable('monux', 'info');


var system = require('./core/services/system');

var wrappers = require('./core/wrappers');
wrappers.createStaticService('kernel', system.kernel);
wrappers.createStaticService('cpu', system.cpu);
wrappers.createStaticService('mem', system.mem);
wrappers.createOnDemandService('disk', system.disk);

var staticData = null;


var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var nunjucks = require('nunjucks');
nunjucks.configure('web', {
  autoescape: true,
  express: app
});

app.get('/', function (req, res) {
  wrappers.collectOnDemandServicesData(function (onDemandData) {
    var data = _.clone(staticData);
    _.assign(data, onDemandData);
    res.render('index.html', data);
  });
});

app.use(express.static(__dirname + '/web'));


wrappers.collectStaticServicesData(function (data) {
  staticData = data;
  server.listen(1337);
  logger.info('Server running at *:1337');
});
