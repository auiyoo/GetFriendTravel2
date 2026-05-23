require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST'] }
});

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/trips', require('./src/routes/trips'));
app.use('/api/matches', require('./src/routes/matches'));
app.use('/api/destinations', require('./src/routes/destinations'));
app.use('/api/plans', require('./src/routes/plans'));
app.use('/api/tours', require('./src/routes/tours'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GetFriendTravel API Running 🚀', version: '1.0.0' });
});

// Socket.io - Real-time notifications
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 GetFriendTravel API running on port ${PORT}`);
  console.log(`📖 Health: http://localhost:${PORT}/api/health\n`);
});
