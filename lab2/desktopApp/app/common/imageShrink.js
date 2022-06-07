const slash = require('slash');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

module.exports = async ({ imgPath, quality, destination }) => {
  try {
    const progressiveQuality = quality / 100
    const files = await imagemin([slash(imgPath)], {
      destination,
      plugins: [
        imageminMozjpeg({ quality }),
        imageminPngquant({ quality: [progressiveQuality, progressiveQuality] })
      ],
    })

    return files[0].destinationPath;
  } catch (error) {
    console.log('error', error)
  }
}