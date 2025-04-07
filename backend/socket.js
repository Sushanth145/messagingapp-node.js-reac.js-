const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Allow requests from frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Example handlers
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  socket.on('register', (username) => {
    console.log(`👤 User registered: ${username}`);
  });

  socket.on('joinRoom', ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join('_');
    socket.join(roomId);
    console.log(`📥 User joined room ${roomId}`);
  });

  socket.on('message', (msg) => {
    const roomId = [msg.senderId, msg.receiverId].sort().join('_');
    console.log(`💬 Message in ${roomId}:`, msg);
    io.to(roomId).emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

server.listen(9000, () => {
  console.log('🚀 Socket.IO server running on http://localhost:9000');
});
