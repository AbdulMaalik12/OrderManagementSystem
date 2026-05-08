const mongoose = require('mongoose');
const { MONGO_URI, NODE_ENV } = require('./env');
const logger = require('../utils/logger');

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

/**
 * Connect to MongoDB with retry logic and exponential backoff.
 */
const connectDB = async () => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(MONGO_URI);
      logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      retries++;
      const delay = RETRY_DELAY_MS * Math.pow(2, retries - 1);
      logger.error(
        `❌ MongoDB connection failed (attempt ${retries}/${MAX_RETRIES}): ${error.message}`
      );

      if (retries === MAX_RETRIES) {
        logger.error('❌ Max retries reached. Exiting...');
        process.exit(1);
      }

      logger.info(`⏳ Retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Connection event listeners
mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error(`❌ MongoDB error: ${err.message}`);
});

module.exports = connectDB;
