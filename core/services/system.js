var proc = require('child_process');
var _ = require('lodash');

exports.kernel = function (done) {
  var res = {};
  var cmd = 'uname -nrp';
  proc.exec(cmd, function (err, stdout, stderr) {
    if (err) return done(err);
    var output = stdout.trim().split(/\s/);
    res.name = output[0];
    res.release = output[1];
    res.arch = output[2];
    return done(null, res);
  });
};

exports.cpu = function (done) {
  var res = {count: 0};
  var cmd = 'cat /proc/cpuinfo';
  proc.exec(cmd, function (err, stdout, stderr) {
    if (err) return done(err);
    var rows = stdout.trim().split(/\r\n|\r|\n/);
    _.forEach(rows, function (row) {
      row = row.trim();
      if (row.indexOf('processor') === 0) {
        res.count++;
      } else if (res.count === 1) {  // all cpu have the same info, it is pointless to parse all
        if (row.indexOf('model name') === 0) {
          res.name = row.match(/model name\s*:(.*)/)[1];
        } else if (row.indexOf('cache size') === 0) {
          res.cache = row.match(/cache size\s*:(.*)/)[1];
        } else if (row.indexOf('flags') === 0) {
          if (row.indexOf('lm') !== -1) res.arch64 = true;
        }
      }
    });
    return done(null, res);
  });
};

exports.mem = function (done) {
  var res = {};
  var cmd = 'free';
  proc.exec(cmd, function (err, stdout, stderr) {
    if (err) return done(err);
    var rows = stdout.trim().split(/\r\n|\r|\n/);
    _.forEach(rows, function (row) {
      row = row.trim();
      if (row.indexOf('Mem') === 0) {
        res.ram = row.match(/Mem:\s*(\d+).*/)[1];
      } else if (row.indexOf('Swap') === 0) {
        res.swap = row.match(/Swap:\s*(\d+).*/)[1];
      }
    });
    return done(null, res);
  });
};

exports.disk = function (done) {
  var res = {total: {}, partitions: []};
  var cmd = 'df -h --total';
  proc.exec(cmd, function (err, stdout, stderr) {
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
