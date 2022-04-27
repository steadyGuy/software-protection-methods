require('dotenv').config()
const { app, BrowserWindow, Menu, globalShortcut, ipcMain, shell } = require('electron');
const imageFilters = require('./app/common/imageFilters')
const imageShrink = require('./app/common/imageShrink')

const licenseInfoExecutor = require('./app/common/licenseInfoExecutor')
const vigenereCipher = require('./app/common/vigenereCipher')

const createAboutWindow = require('./app/dialogs/aboutDialog')
const createMainWindow = require('./app/dialogs/mainDialog')

process.env.NODE_ENV = 'production'

const currentEnv = {
  isDev: process.env.NODE_ENV !== 'production',
  isLinux: process.platform === 'linux',
  isWindows: process.platform === 'darwin',
  isMac: (!(process.platform === 'linux') && !(process.platform === 'darwin')) ? true : false
}

let mainWindow, licenseInfo

ipcMain.on('image:customize', async (e, options) => {
  let newDest
  newDest = await imageShrink(options)
  if (options.filters.length > 0) {
    await imageFilters({ ...options, imgPath: newDest })
  }
  shell.openPath(options.destination)
  mainWindow.webContents.send("image:done")
})

ipcMain.on('app:activate', async (e, options) => {
  if (!options.code)
    return mainWindow.webContents.send("app:warningConfirmation")

  const decryptedByUser =
    vigenereCipher.decrypt(licenseInfo.codedPhrase, vigenereCipher.generateKey(options.code, licenseInfo.codedPhrase))
  const decrypotedOriginal =
    vigenereCipher.decrypt(licenseInfo.codedPhrase, vigenereCipher.generateKey(process.env.SECRET_KEY, licenseInfo.codedPhrase))

  if (decrypotedOriginal === decryptedByUser) {
    mainWindow.webContents.send("app:activated")
    licenseInfoExecutor.updateLicense("isConfirmed", true)
  } else {
    mainWindow.webContents.send("app:warningConfirmation")
  }

})

const menu = [
  ...(currentEnv.isMac ? [{ role: 'appMenu' }] : []),
  {
    label: 'About View',
    click: createAboutWindow
  }
]

const licenceInfoPromise = licenseInfoExecutor.getLicenseInfo()

app.whenReady().then(() => {
  mainWindow = createMainWindow();

  if (currentEnv.isDev) {
    globalShortcut.register('F12', () => mainWindow.toggleDevTools())
    globalShortcut.register('Ctrl+R', () => mainWindow.reload())
  }

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      createMainWindow();
  })

  mainWindow.on('ready', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('did-finish-load', async () => {
    licenseInfo = (await licenceInfoPromise)
    if (licenseInfo.isLicensedExpired) {
      mainWindow.webContents.send("app:expiredLicense")
    }
  });

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});