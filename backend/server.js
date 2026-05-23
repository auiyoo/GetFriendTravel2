require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const { init: initMockStore } = require('./src/data/mockStore');

const app = express();
const server = http.createServer(app);
const isProd = process.env.NODE_ENV === 'production';

const io = new Server(server, {
  cors: {
    origin: isProd ? '*' : (process.env.CLIENT_URL || 'http://localhost:5173'),
    methods: ['GET', 'POST']
  }
});

// Connect DB (non-fatal) then initialize mock store
connectDB().then(() => {
  // Always init mock store — it's a no-op when DB is connected
  initMockStore();
});

// Middleware
app.use(cors({
  origin: isProd ? '*' : (process.env.CLIENT_URL || 'http://localhost:5173')
}));
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

// ── Serve React frontend in production ──
if (isProd) {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  // All non-API routes → serve React app
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
  console.log('🌐 Serving frontend from:', distPath);
}

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
