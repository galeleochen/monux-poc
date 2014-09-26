(function () {
  'use strict';

  var socket = io('/');

  socket.on('data', function (data) {
    console.log(data);
  });
})();

