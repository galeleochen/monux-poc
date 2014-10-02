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

exports.cpusUsages = (function () {
  var metrics = ['user', 'sys', 'nice', 'irq', 'idle'];
  var prevTimes = [];

  return function (cb) {
    var cpus = os.cpus();
    var cpusCount = cpus.length;
    var res = {total: {}, perCpu: []};

    _.forEach(cpus, function (cpu, idx) {
      var prev = prevTimes[idx];
      var curr = cpu.times;
      var computed = {};

      if (prev) {
        var total = 0;
        _.forEach(metrics, function (metric) {
          computed[metric] = curr[metric] - prev[metric];
          prev[metric] = curr[metric];
          total += computed[metric];
        });

        _.forEach(metrics, function (metric) {
          computed[metric] = _.toFixed(computed[metric] * 100 / total, 2);

          if (!res.total[metric]) res.total[metric] = 0;
          res.total[metric] += computed[metric];
        });

        res.perCpu.push(computed);
      } else {
        prevTimes[idx] = {};
        _.forEach(metrics, function (metric) {
          prevTimes[idx][metric] = curr[metric];
        });
      }
    });

    _.forEach(_.keys(res.total), function (key) {
      res.total[key] = _.toFixed(res.total[key] / cpusCount, 2);
    });

    cb(null, res);
  };
})();

exports.mem = function (cb) {
  var total = os.totalmem();
  var free = os.freemem();
  var used = total - free;
  cb(null, {
    total: Math.round(total/1000000),
    used: Math.round(used/1000000),
    percent: _.toFixed(used * 100 / total, 2)
  });
};

exports.load = function (cb) {
  var load = os.loadavg();
  cb(null, {
    m1: _.toFixed(load[0], 2),
    m5: _.toFixed(load[1], 2),
    m15: _.toFixed(load[2], 2)
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
