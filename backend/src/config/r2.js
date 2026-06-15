const { S3Client } = require('@aws-sdk/client-s3');
const { NodeHttpHandler } = require('@smithy/node-http-handler');
const https = require('https');
const logger = require('./logger');

let r2Client = null;

const getR2Client = () => {
  if (r2Client) return r2Client;

  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    logger.warn('R2 credentials not fully configured. File uploads will be unavailable.');
    return null;
  }

  // Custom HTTPS agent that tolerates Cloudflare R2's TLS on Windows/Node 20
  const httpsAgent = new https.Agent({
    keepAlive: true,
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.3',
  });

  r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: false,
    requestHandler: new NodeHttpHandler({
      httpsAgent,
      connectionTimeout: 10000,
      requestTimeout: 30000,
    }),
  });

  logger.info('Cloudflare R2 client initialized');
  return r2Client;
};

// Reset client so it gets recreated with fresh config on next call
const resetR2Client = () => { r2Client = null; };

module.exports = { getR2Client, resetR2Client };
