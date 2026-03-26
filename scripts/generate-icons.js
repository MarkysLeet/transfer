const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'public', 'icons', 'logo.png');
const output192Path = path.join(__dirname, '..', 'public', 'icons', 'icon-192x192.png');
const output512Path = path.join(__dirname, '..', 'public', 'icons', 'icon-512x512.png');

async function generateIcons() {
  try {
    const metadata = await sharp(inputPath).metadata();

    // Calculate resize dimensions to leave safe area (e.g. 80% of container)
    const size192 = Math.round(192 * 0.8);
    const size512 = Math.round(512 * 0.8);

    const resizedFor192 = await sharp(inputPath).resize({ width: size192, height: size192, fit: 'inside' }).toBuffer();
    const resizedFor512 = await sharp(inputPath).resize({ width: size512, height: size512, fit: 'inside' }).toBuffer();

    await sharp({
      create: {
        width: 192,
        height: 192,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([
      { input: resizedFor192, gravity: 'center' }
    ])
    .png()
    .toFile(output192Path);

    await sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([
      { input: resizedFor512, gravity: 'center' }
    ])
    .png()
    .toFile(output512Path);

    console.log('Icons generated successfully.');
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generateIcons();