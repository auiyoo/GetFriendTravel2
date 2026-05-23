const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set — running without database (demo mode)');
    console.warn('   Set MONGODB_URI in Railway Variables for full functionality');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.warn('⚠️  Server will continue without database (limited functionality)');
    // DO NOT process.exit(1) — keep server alive to serve the frontend
  }
};

const checkDB = () => isConnected;

module.exports = connectDB;
module.exports.checkDB = checkDB;
