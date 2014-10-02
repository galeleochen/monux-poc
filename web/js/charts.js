(function () {
  'use strict';

  if (!window.monux) window.monux = {};
  var monux = window.monux;

  monux.charts = {};
  monux.charts.cpusPoints = [];
  monux.charts.cpuPoints = null;
  monux.charts.memPoints = null;

  monux.charts.init = function () {

    Highcharts.setOptions({
      global: {
        useUTC: true
      }
    });

    $('.cpuChart').each(function (idx, slot) {
      $(slot).highcharts('StockChart', {
        chart: {
          type: 'area',
          events: {
            load: function () {
              monux.charts.cpusPoints[idx] = {
                user: this.series[0],
                sys: this.series[1],
                nice: this.series[2],
                irq: this.series[3]
              };
            }
          }
        },

        legend: {
          enabled: true
        },

        rangeSelector: false,

        title: {
          text: '%CPU ' + idx
        },

        series: [
          {
            name: 'user',
            data: []
          },
          {
            name :'sys',
            data: []
          },
          {
            name: 'nice',
            data: []
          },
          {
            name: 'irq',
            data: []
          }
        ],

        yAxis: [
          {
            min: 0,
            max: 100
          }
        ]
      });
    });

    $('#cpuChart').highcharts('StockChart', {
      chart: {
        type: 'area',
        events: {
          load: function () {
            monux.charts.cpuPoints = {
              user: this.series[0],
              sys: this.series[1],
              nice: this.series[2],
              irq: this.series[3]
            };
          }
        }
      },

      legend: {
        enabled: true
      },

      rangeSelector: false,

      title: {
        text: '%CPU'
      },

      series: [
        {
          name: 'user',
          data: []
        },
        {
          name :'sys',
          data: []
        },
        {
          name: 'nice',
          data: []
        },
        {
          name: 'irq',
          data: []
        }
      ],

      yAxis: [
        {
          min: 0,
          max: 100
        }
      ]
    });

    $('#memChart').highcharts('StockChart', {
      chart: {
        type: 'area',
        events: {
          load: function () {
            monux.charts.memPoints = this.series[0];
          }
        }
      },

      legend: {
        enabled: true
      },

      rangeSelector: false,

      title: {
        text: '%RAM'
      },

      series: [
        {
          name: 'ram',
          data: []
        }
      ],

      yAxis: [
        {
          min: 0,
          max: 100
        }
      ]
    });
  };
})();
