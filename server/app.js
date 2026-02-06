const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/error.middleware');
const socketAuth = require('./middleware/socket-auth.middleware');
const reminderScheduler = require('./services/reminder-scheduler.service');

// Load environment variables
dotenv.config();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Connect to database (async, but don't block server start)
connectDB().catch(err => {
  console.error('Database connection failed:', err.message);
  console.log('Server will continue without database connection');
});

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store io instance for use in routes/controllers
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/mood', require('./routes/mood.routes'));
app.use('/api/journal', require('./routes/journal.routes'));
app.use('/api/goals', require('./routes/goals.routes'));
app.use('/api/community', require('./routes/community.routes'));
app.use('/api/resources', require('./routes/resources.routes'));
app.use('/api/reminders', require('./routes/reminders.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/insights', require('./routes/insights.routes'));

// Socket.IO connection handling
io.use(socketAuth);

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.userId}`);
  
  // Join user-specific room
  socket.join(`user:${socket.userId}`);
  
  // Handle mood updates
  socket.on('mood:created', (data) => {
    // Broadcast to user's own dashboard
    socket.to(`user:${socket.userId}`).emit('mood:updated', data);
  });
  
  // Handle journal updates
  socket.on('journal:created', (data) => {
    socket.to(`user:${socket.userId}`).emit('journal:updated', data);
  });
  
  // Handle goal updates
  socket.on('goal:updated', (data) => {
    socket.to(`user:${socket.userId}`).emit('goal:changed', data);
  });
  
  // Community posts (broadcast to all)
  socket.on('post:created', (data) => {
    io.emit('post:new', data);
  });
  
  socket.on('comment:created', (data) => {
    io.emit('comment:new', data);
  });
  
  socket.on('post:liked', (data) => {
    io.emit('post:like-updated', data);
  });
  
  // Reminder events (handled by scheduler, but listen for client updates)
  socket.on('reminder:created', (data) => {
    socket.to(`user:${socket.userId}`).emit('reminder:created', data);
  });
  
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.userId}`);
  });
});

// Start reminder scheduler
reminderScheduler.start(io);

// Serve HTML files - must be after API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  
  if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return next();
  }
  
  const filePath = path.join(__dirname, '../client', req.path === '/' ? 'index.html' : req.path);
  res.sendFile(filePath, { root: path.join(__dirname, '../client') }, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, '../client/index.html'));
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 MindNest server running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} in your browser`);
  console.log(`🔌 Socket.IO ready for real-time updates`);
});

module.exports = { app, server, io };
