const express = require('express');
const app = express();

const Server = require('http').Server(app);
const io = require('socket.io')(Server);
// const { ExpressPeerServer } = require('peer');
// const peerServer = ExpressPeerServer(Server, { debug: true });

const route = require('./router');
//const socket = require('./router/socket');

app.set('view engine', 'ejs');

// medelwere
app.use('/public', express.static('public'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use('/', route);
//app.use('/peerjs', peerServer);

io.on('connection', (socket) => {
  socket.on('join-room', (roomID, userID) => {
    socket.join(roomID);
    socket.to(roomID).emit('user-connected', userID);
    socket.on('message', (message, username) => {
      io.to(roomID).emit('createMessage', message, username);
    });
    socket.on('disconnect', () => {
      socket.to(roomID).emit('user-disconnected', userID);
    });
  });
});

const port = process.env.PORT || 3030;
Server.listen(port, () =>
  console.log(`server link ${'http://localhost:' + port}`)
);
