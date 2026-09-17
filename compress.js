const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

sharp.cache(false);

const dir = 'public/images/retail';

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function processImages() {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (!file.endsWith('.webp')) {
      const srcPath = path.join(dir, file);
      const parsed = path.parse(file);
      const newName = sanitizeFilename(parsed.name) + '.webp';
      const outPath = path.join(dir, newName);
      const tmpPath = outPath + '.tmp';

      try {
        await sharp(srcPath)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80, effort: 6 })
          .toFile(tmpPath);

        fs.renameSync(tmpPath, outPath);
        console.log(`Converted ${file} -> ${newName}`);

        // Delete original file
        fs.unlinkSync(srcPath);
      } catch (e) {
        console.error(`Error processing ${file}:`, e);
      }
    }
  }
}

processImages();
