const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { getR2Client } = require('../config/r2');
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL;

/**
 * Upload a buffer to Cloudflare R2
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Folder path in bucket
 * @param {string} contentType - MIME type
 * @param {string} [filename] - Optional custom filename
 * @returns {string} Public URL of uploaded file
 */
const uploadToR2 = async (buffer, folder, contentType = 'image/webp', filename = null) => {
  const client = getR2Client();
  if (!client) throw new Error('R2 client not initialized');

  const key = `${folder}/${filename || uuidv4()}.webp`;

  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000',
    })
  );

  logger.info(`Uploaded file to R2: ${key}`);
  return `${PUBLIC_URL}/${key}`;
};

/**
 * Delete a file from R2 by URL
 * @param {string} url - Full public URL
 */
const deleteFromR2 = async (url) => {
  const client = getR2Client();
  if (!client) throw new Error('R2 client not initialized');

  const key = url.replace(`${PUBLIC_URL}/`, '');

  await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  logger.info(`Deleted file from R2: ${key}`);
};

/**
 * Get a presigned URL for direct upload
 * @param {string} key - Object key
 * @param {string} contentType
 * @param {number} expiresIn - Seconds (default 300)
 */
const getPresignedUploadUrl = async (key, contentType, expiresIn = 300) => {
  const client = getR2Client();
  if (!client) throw new Error('R2 client not initialized');

  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
  return getSignedUrl(client, command, { expiresIn });
};

/**
 * Get presigned download URL
 */
const getPresignedDownloadUrl = async (key, expiresIn = 3600) => {
  const client = getR2Client();
  if (!client) throw new Error('R2 client not initialized');

  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(client, command, { expiresIn });
};

module.exports = { uploadToR2, deleteFromR2, getPresignedUploadUrl, getPresignedDownloadUrl };
