const nodemailer = require('nodemailer');
const logger = require('./logger');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: parseInt(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });

  transporter.verify((error) => {
    if (error) {
      logger.warn(`Email transporter verification failed: ${error.message}`);
    } else {
      logger.info('Email transporter ready');
    }
  });

  return transporter;
};

module.exports = { getTransporter };
