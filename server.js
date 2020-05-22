const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
const { addMessage } = require('./utils/chat');

// Setting up express server to user SocketIO
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Connect to database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(fileUpload());

app.get('/', (req, res) => res.send('API Running'));

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
app.use('/api/freelance/services', require('./routes/api/freelance/services'));
app.use('/api/chat/conversations', require('./routes/api/chat/conversations'));

// Setup SocketIO to send and receive messages in real time in chat module
io.on('connection', (socket) => {
  // This is called whenever a user joins the chat
  socket.on('joinRoom', ({ user, room }) => {
    // Add user to the room
    socket.join(room);

    // Broadcast the message in the room that the user has joined the chat
    socket.broadcast.emit('joinRoom', `${user.name} has joined the chat`);
  });

  // This is called whenever the user sends a message
  socket.on('message', async ({ room, user, message }) => {
    // Add message to the conversation
    const conversation = await addMessage(room, user, message);

    // Broadcast the conversation object to everyone in the room
    io.to(room).emit('message', conversation);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
