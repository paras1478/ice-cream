const mongoose = require('mongoose');
const logger = require('./logger');

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000;

const connectDB = async (retries = MAX_RETRIES) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);

    if (retries > 0) {
      logger.info(`Retrying in ${RETRY_DELAY_MS / 1000}s... (${retries} attempts left)`);
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      return connectDB(retries - 1);
    }

    logger.error('Max retries reached. Server will start without database connection.');
    logger.error('IMPORTANT: Please whitelist your IP address in MongoDB Atlas Network Access settings.');
    logger.error('Visit: https://cloud.mongodb.com -> Network Access -> Add IP Address');
    // Don't exit - let server start anyway for testing
    return null;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
  }
};

module.exports = { connectDB, disconnectDB };
