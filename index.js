var app = require('express')();
var http = require('http').Server(app);
// var io = require('socket.io')(http);
var bodyParser = require('body-parser')
var cors = require('cors');
app.use(cors())
const connectDB = require('./db');
connectDB()
const io = require('socket.io')(http, { cors: { origin: "*" } });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js')
io.on('connection', function (socket) {
  console.log('user connected')
  socket.on('join', ({ name, room, msg, type, userType }, callback) => {
    const id = socket.id
    const { user } = addUser({ name, room, msg, id, type, userType })
    socket.join(user.room);
    socket.broadcast.emit('users', { user })
    if (user.name !== 'admin') {
      socket.emit('message', { user: `${user.name}`, text: `Name:${user.name}    Email:${user.room}   Type:${user.type}   Message:${user.msg}`, msgid: `${user.room}` });
      setTimeout(function () {
        socket.emit('message', { user: 'admin', text: `Please provide your contact so that we can reach you for more details. Our agent will respond in a min.`, msgid: `${user.room}` });
      }, 2000);
    }
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    callback()
  })
  socket.on('sendMessage', (message, name, room, d,callback) => {
    const user = getUser(room, name);
    io.to(user.room).emit('message', { user: user.name, text: message, msgid: user.room,date:d });
    callback();
  });
  socket.on('disconnect', () => {
    console.log('user diconnect')
    const user = removeUser(socket.id)
    if (user) {
      socket.broadcast.emit('end', { user: 'admin', text: `${user.name} has left.`, email: `${user.room}` })
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.`, email: `${user.room}` })
    }
  })
});
const entityRoutes = require('./router')
app.use('/api', entityRoutes);
const port=process.env.PORT || 5000
http.listen(port, function () {
  console.log('listening on localhost:5000');
});

