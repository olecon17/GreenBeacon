var server = require('./server');
var io = require('socket.io').listen(server);

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('addTicket', () => {
    io.emit('ticketChange');
  });

  socket.on('claimTicket', () => {
    io.emit('ticketChange');
  });

  socket.on('solveTicket', () => {
    io.emit('ticketChange');
  });

  socket.on('unsolvedTicket', () => {
    io.emit('ticketChange');
  })
});
