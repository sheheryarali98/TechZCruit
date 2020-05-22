const express = require('express');
const connectDB = require('./config/db');
const fileUpload = require('express-fileupload');

// const http = require("http");

// const { removeUser } = require("./joinusers");

const app = express();
// socket io
// const http = require("http").Server(app); //change
// const socketio = require("socket.io");
// const io = socketio(http); //change
// var server = require("http").Server(app);
// var io = require("socket.io")(server);
const socketIO = require('socket.io');
// Connect to database
connectDB();

// const server = http.createServer(app);
// const io = socketio(server);

// Init Middleware
app.use(express.json({ extended: false }));
app.use(fileUpload());

app.get('/', (req, res) => res.send('API Running'));

// io.on("connection", function(socket) {
//   console.log("Socket connected");
// });

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profiles', require('./routes/api/profiles'));
app.use('/api/community/groups', require('./routes/api/community/groups'));
app.use('/api/community/posts', require('./routes/api/community/posts'));
app.use(
  '/api/crowdfunding/campaigns',
  require('./routes/api/crowdfunding/campaigns')
);
app.use('/api/testing/projects', require('./routes/api/testing/projects'));

app.use('/api/ecommerce/products', require('./routes/api/ecommerce/products'));
app.use('/api/ecommerce/stores', require('./routes/api/ecommerce/stores'));

const PORT = process.env.PORT || 5000;

// const socketioport = process.env.PORT || 6666;
// http.listen(socketioport, () => {
//   console.log("Socket connected on port: " + socketioport);
// });

const server = app.listen(PORT, () =>
  console.log(`Server started on PORT ${PORT}`)
);

const io = socketIO(server);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data + ' connection data');
  });
});

const users = [];
const addUser = ({ id, name, room }) => {
  // Zeeshan Mushtaq = zeeshanmushtaq
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (!name || !room) return { error: 'Username and room are required.' };
  if (existingUser) return { error: 'Username is taken.' };

  // if room not taken: new user created
  const user = { id, name, room };

  users.push(user);

  return { user };
};
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
const getUser = (id) => {
  users.find((user) => user.id === id);
  console.log('id succese called');
};
// socket io connection
io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    // users.push({ id: socket.id, name, room });

    console.log(users, 'users array of user');

    if (error) return callback(error);
    console.log('user has join');
    users.map((item) => {
      console.log('join run', item.name, item.room, item);
      io.to(item.room).emit('roomData', {
        room: item.room,
        user: getUsersInRoom(item.room),
      });

      socket.emit('message', {
        user: 'admin',
        text: `${item.name}, welcome to the room ${item.room}`,
      });
      console.log('admin welcome,', item);
      // const { user, name } = users;

      socket.broadcast
        .to(item.room)
        .emit('message', { user: 'admin', text: `${item.name} has joined!` });
      console.log('admin  join', item.name, item.room);
      socket.join(item.room);
      callback();
      console.log('callback end');
    });
  });

  socket.on('sendMessage', (message, callback) => {
    console.log(users, ' msg ');
    // const user = users.find(user => user.id === socket.id);
    const user = getUser(socket.id);
    // const user = ;
    console.log(user, 'send msg2');

    io.to(user.room).emit('message', { user: user.name, text: message });
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
    console.log('send message call hota ha');
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'Admin',
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});
