const Stripe = require('stripe');
const logger = require('./logger');

let stripeInstance = null;

const getStripe = () => {
  if (stripeInstance) return stripeInstance;

  if (!process.env.STRIPE_SECRET_KEY) {
    logger.warn('STRIPE_SECRET_KEY not set. Payment features will be unavailable.');
    return null;
  }

  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    maxNetworkRetries: 3,
    timeout: 10000,
  });

  logger.info('Stripe client initialized');
  return stripeInstance;
};

module.exports = { getStripe };
