var os = require('os');
var proc = require('child_process');
var _ = require('lodash');

exports.hostname = function (cb) {
  cb(null, os.hostname());
};

exports.kernel = function (cb) {
  cb(null, {
    release: os.release(),
    arch: os.arch()
  });
};

exports.uptime = function (cb) {
  var uptime = os.uptime();
  var remainder;
  var days = Math.floor(uptime / 86400);  // 86400 seconds in day
  remainder = uptime % 86400;
  var hours = Math.floor(remainder / 3600);
  remainder = remainder % 3600;
  var minutes = Math.floor(remainder / 60);
  var seconds = Math.floor(remainder % 60);
  cb(null, {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  });
};

exports.cpus = function (cb) {
  var cpus = os.cpus();
  cb(null, {
    model: cpus[0].model,
    count: cpus.length
  });
};

exports.mem = function (cb) {
  var total = os.totalmem();
  var free = os.freemem();
  var used = total - free;
  cb(null, {
    total: Math.round(total/1000000),
    used: Math.round(used/1000000),
    percent: parseFloat(((used * 100) / total).toFixed(2))
  });
};

exports.load = function (cb) {
  var load = os.loadavg();
  cb(null, {
    m1: parseFloat(load[0].toFixed(2)),
    m5: parseFloat(load[1].toFixed(2)),
    m15: parseFloat(load[2].toFixed(2))
  });
};

exports.ifaces = function (cb) {
  cb(null, os.networkInterfaces());
};

exports.disk = function (done) {
  var res = {total: {}, partitions: []};
  var cmd = 'df -h --total';
  proc.exec(cmd, function (err, stdout) {
    if (err) return done(err);
    var keys = ['name', 'size', 'used', 'free', 'percent', 'mount'];
    var rows = stdout.trim().split(/\r\n|\r|\n/);
    rows.shift();
    _.forEach(rows, function (row) {
      row = row.trim();
      var details = row.match(/([^\s]+)\s+([\d|,]+[G|M|K]*)\s+([\d|,]+[G|M|K]*)\s+([\d|,]+[G|M|K]*)\s+(\d+%)\s*(.*)/);
      if (details[1] === 'total') {
        res.total = _.zipObject(keys.slice(1, 5), details.slice(2, 6));
        res.total.percent = parseInt(res.total.percent.substring(0, res.total.percent.length - 1));
      } else {
        var partition = _.zipObject(keys, details.slice(1));
        res.partitions.push(partition);
        partition.percent = parseInt(partition.percent.substring(0, partition.percent.length - 1));
      }
    });
    return done(null, res);
  });
};
