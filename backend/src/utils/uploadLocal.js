const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

async function uploadLocalImage(buffer, folder = 'products') {
  const dir = path.join(UPLOAD_DIR, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filename = `${uuidv4()}.webp`;
  const filepath = path.join(dir, filename);

  await sharp(buffer)
    .resize(1200, null, { withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 85 })
    .toFile(filepath);

  return `${BASE_URL}/uploads/${folder}/${filename}`;
}

async function uploadManyLocal(files, folder = 'products') {
  const urls = [];
  for (const file of files) {
    const url = await uploadLocalImage(file.buffer, folder);
    urls.push(url);
  }
  return urls;
}

module.exports = { uploadLocalImage, uploadManyLocal };
