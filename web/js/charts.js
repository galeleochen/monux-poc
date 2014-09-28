(function () {
  'use strict';

  if (!window.monux) window.monux = {};
  var monux = window.monux;

  monux.charts = {};
  monux.charts.cpuPoints = [];
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
              monux.charts.cpuPoints[idx] = {
                user: this.series[0],
                sys: this.series[1],
                idle: this.series[2]
              };
            }
          }
        },

        legend: {
          enabled: true
        },

        rangeSelector: {
          buttons: [
            {
              count: 1,
              type: 'minute',
              text: '1M'
            },
            {
              count: 5,
              type: 'minute',
              text: '5M'
            },
            {
              type: 'all',
              text: 'All'
            }
          ],
          inputEnabled: false,
          selected: 0
        },

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
            name: 'idle',
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

    $('#memChart').highcharts('StockChart', {
      chart: {
        type: 'area',
        events: {
          load: function () {
            monux.charts.memPoints = this.series[0];
          }
        }
      },

      rangeSelector: {
        buttons: [
          {
            count: 1,
            type: 'minute',
            text: '1M'
          },
          {
            count: 5,
            type: 'minute',
            text: '5M'
          },
          {
            type: 'all',
            text: 'All'
          }
        ],
        inputEnabled: false,
        selected: 0
      },

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

