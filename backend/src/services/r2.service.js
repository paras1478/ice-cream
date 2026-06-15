const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { uploadToR2, deleteFromR2, getPresignedUploadUrl } = require('../utils/uploadToR2');
const { ApiError } = require('../utils/ApiError');
const logger = require('../config/logger');

class R2Service {
  /**
   * Process and upload image to R2
   * @param {Buffer} buffer - Raw file buffer
   * @param {string} folder - Destination folder in bucket
   * @param {Object} options
   */
  async processAndUpload(buffer, folder, { width = 1200, quality = 85 } = {}) {
    const processed = await sharp(buffer)
      .resize(width, null, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality })
      .toBuffer();

    const filename = uuidv4();
    return uploadToR2(processed, folder, 'image/webp', filename);
  }

  /**
   * Upload multiple images
   */
  async uploadMany(files, folder) {
    const urls = [];
    for (const file of files) {
      const url = await this.processAndUpload(file.buffer, folder);
      urls.push(url);
    }
    return urls;
  }

  /**
   * Delete image by URL
   */
  async deleteImage(url) {
    return deleteFromR2(url);
  }

  /**
   * Get presigned URL for client-side upload
   */
  async getPresignedUrl(folder, contentType = 'image/webp') {
    const key = `${folder}/${uuidv4()}.webp`;
    const url = await getPresignedUploadUrl(key, contentType, 300);
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    return { uploadUrl: url, publicUrl, key };
  }
}

module.exports = new R2Service();
