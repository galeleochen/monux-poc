$(function () {
  'use strict';

  if (!window.monux) window.monux = {};
  var monux = window.monux;

  var els = {
    load: {
      m1: $('.load-m1'),
      m5: $('.load-m5'),
      m15: $('.load-m15')
    },
    mem: {
      total: $('.mem-total'),
      used: $('.mem-used')
    },
    uptime: {
      days: $('.uptime-days'),
      hours: $('.uptime-hours'),
      minutes: $('.uptime-minutes'),
      seconds: $('.uptime-seconds')
    }
  };

  monux.charts.init();

  var socket = io('/');

  socket.on('data', function (data) {
    els.load.m1.html(data.load.m1);
    els.load.m5.html(data.load.m5);
    els.load.m15.html(data.load.m15);
    els.mem.total.html(data.mem.total);
    els.mem.used.html(data.mem.used);
    els.uptime.days.html(data.uptime.days);
    els.uptime.hours.html(data.uptime.hours);
    els.uptime.minutes.html(data.uptime.minutes);
    els.uptime.seconds.html(data.uptime.seconds);

    if (data.cpusUsages.length === monux.charts.cpuPoints.length) {
      monux.charts.cpuPoints.forEach(function (cpuPoints, idx) {
        var usage = data.cpusUsages[idx];
        cpuPoints.user.addPoint([Date.now(), usage.user], true);
        cpuPoints.sys.addPoint([Date.now(), usage.sys], true);
        cpuPoints.idle.addPoint([Date.now(), usage.idle], true);
      });
    }

    if (monux.charts.memPoints) {
      var memPoint = [
        Date.now(),
        data.mem.percent
      ];
      monux.charts.memPoints.addPoint(memPoint, true);
    }
  });
});
