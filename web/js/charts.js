(function () {
  'use strict';

  if (!window.monux) window.monux = {};
  var monux = window.monux;

  monux.charts = {};
  monux.charts.cpuPoints = null;
  monux.charts.memPoints = null;

  monux.charts.init = function () {

    Highcharts.setOptions({
      global: {
        useUTC: true
      }
    });

    $('#cpuChart').highcharts('StockChart', {
      chart: {
        type: 'area',
        events: {
          load: function () {
            monux.charts.cpuPoints = this.series[0];
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
        text: '%CPU'
      },

      series: [
        {
          name: 'cpu',
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

