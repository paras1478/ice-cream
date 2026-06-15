const r2Service = require('../services/r2.service');
const { uploadManyLocal } = require('../utils/uploadLocal');
const { deleteFromR2 } = require('../utils/uploadToR2');
const { ApiError } = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');

const USE_LOCAL = process.env.USE_LOCAL_STORAGE === 'true';

const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'No images provided');
  }

  const folder = req.body.folder || req.query.folder || 'products';
  let urls = [];

  if (USE_LOCAL) {
    logger.info('Using local storage for upload');
    urls = await uploadManyLocal(req.files, folder);
  } else {
    try {
      urls = await r2Service.uploadMany(req.files, folder);
    } catch (r2Err) {
      logger.warn(`R2 upload failed (${r2Err.message}), falling back to local storage`);
      urls = await uploadManyLocal(req.files, folder);
    }
  }

  logger.info('Upload successful', { urls });
  return ApiResponse.success(res, `${urls.length} image(s) uploaded`, { urls });
});

const deleteImage = asyncHandler(async (req, res) => {
  const { url } = req.body;
  if (!url) throw new ApiError(400, 'Image URL is required');

  await deleteFromR2(url);
  return ApiResponse.success(res, 'Image deleted');
});

const getPresignedUrl = asyncHandler(async (req, res) => {
  const { folder = 'products', contentType = 'image/webp' } = req.query;
  const result = await r2Service.getPresignedUrl(folder, contentType);
  return ApiResponse.success(res, 'Presigned URL generated', result);
});

module.exports = { uploadImages, deleteImage, getPresignedUrl };
