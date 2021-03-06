// This script licensed under the MIT.
// http://orgachem.mit-license.org

var PORT = process.env.PORT || 8888;
var io = require('socket.io').listen(PORT);

var userCounter = 0;

io.sockets.on('connection', function (socket) {
  var userId = userCounter++;

  socket.on('send_piine', function () {
    socket.volatile.broadcast.emit('receive_piine', userId);
    console.log('piine! from ' + userId);
  });

  socket.on('disconnect', function() {
    socket.broadcast.emit('leave', userId);
    console.log('user ' + userId + ' was left');
  });

  socket.broadcast.emit('join', userId);
  console.log('user ' + userId + ' was joined');
});
