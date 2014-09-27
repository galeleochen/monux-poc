var _ = require('lodash');


var logmore = require('logmore');
logmore.use(require('logmore-console')());
var logger = logmore('monux');
logmore.enable('monux', 'info');


var services = require('./core/services');

var wrappers = require('./core/wrappers');

wrappers.createStaticService('hostname', services.hostname);
wrappers.createStaticService('kernel', services.kernel);
wrappers.createStaticService('cpus', services.cpus);

wrappers.createOnDemandService('uptime', services.uptime);
wrappers.createOnDemandService('load', services.load);
wrappers.createOnDemandService('mem', services.mem);
wrappers.createOnDemandService('ifaces', services.ifaces);
wrappers.createOnDemandService('disk', services.disk);

wrappers.createStreamService('uptime', services.uptime);
wrappers.createStreamService('load', services.load);
wrappers.createStreamService('mem', services.mem);

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


setInterval(function () {
  wrappers.collectStreamServicesData(function (data) {
    io.emit('data', data);
  });
}, 1000);


wrappers.collectStaticServicesData(function (data) {
  staticData = data;
  server.listen(1337);
  logger.info('Server running at *:1337');
});
