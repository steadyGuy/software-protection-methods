const { BrowserWindow } = require('electron');

module.exports = () => {
  let mainWindow = new BrowserWindow({
    width: 550,
    height: 750,
    icon: '../icons/Icon_256x256.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  mainWindow.loadFile('app/views/index.html')
  return mainWindow
}
