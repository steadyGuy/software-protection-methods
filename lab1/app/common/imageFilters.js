const Filter = require('node-image-filter')
const fs = require('fs')
const slash = require('slash');

module.exports = async ({ imgPath, filters, destination }) => {
  try {
    let newImagePath;
    for await (filter of filters) {
      newImagePath = await new Promise((resolve, reject) => {
        Filter.render(newImagePath || imgPath, Filter.preset[filter], (result) => {

          /* result format
          {
              data : Readble stream,
              type : appropriate format,
              width : number,
              height : number
          }
          */
         
          const fullDestination = slash(imgPath)

          const pipeStream = result.data.pipe(fs.createWriteStream(fullDestination));
          pipeStream.on('finish', () => {
            resolve(fullDestination)
          })
        })
      })
    }

    return newImagePath
  } catch (error) {
    console.log('error', error)
  }
}