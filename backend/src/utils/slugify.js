const slugifyLib = require('slugify');

/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - Input text
 * @returns {string} Slugified string
 */
const slugify = (text) => {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
  });
};

module.exports = slugify;
