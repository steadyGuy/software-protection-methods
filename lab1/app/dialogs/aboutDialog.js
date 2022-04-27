const { BrowserWindow } = require('electron');

module.exports = (aboutWindow) => {
  aboutWindow = new BrowserWindow({
    width: 400,
    height: 300,
    icon: '../icons/Icon_256x256.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  aboutWindow.loadFile('app/views/about.html')
}
