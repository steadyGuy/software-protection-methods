const fs = require('fs')
const slash = require('slash')
const os = require("os")
const vigenereCipher = require('./vigenereCipher')
const randomSymbols = require('./randomSymbols')

// this path is the same for both, linux and windows
// for mac os should be same as well, but I didn't check
const licensePath = slash(`${os.homedir()}/.ssh/license`)

module.exports = {
  _readLicense() {
    try {
      const licenseData = fs.readFileSync(licensePath, { encoding: 'utf8', flag: 'r' })
      const licenseObj = JSON.parse(licenseData)

      return licenseObj
    } catch (err) {
      if (err.code === 'ENOENT') {
        // it works sync, because it should be completed very quickly
        const initialLicense = this._generateLicense()
        fs.writeFileSync(licensePath, JSON.stringify(initialLicense))
        return initialLicense
      } else {
        console.log('Error', err)
      }
    }
  },
  _generateLicense() {
    const ThirtyDaysInMs = 1000 * 60 * 60 * 24 * 30
    const currentDateInMs = new Date().getTime()

    const phrase = randomSymbols()
    const codedPhrase = vigenereCipher.encrypt(phrase, vigenereCipher.generateKey(process.env.SECRET_KEY, phrase))
    const initialLicense = {
      launchesNumber: 0,
      expires: currentDateInMs + ThirtyDaysInMs,
      isConfirmed: false,
      codedPhrase
    }

    return initialLicense
  },
  async getLicenseInfo() {
    try {
      const licenseObj = this._readLicense()

      if (licenseObj.isConfirmed)
        return { isLicensedExpired: false }

      if (licenseObj && (Number(licenseObj.launchesNumber) >= 3 || licenseObj.expires <= new Date().getTime()))
        return { isLicensedExpired: true, codedPhrase: licenseObj.codedPhrase }

      licenseObj.launchesNumber += 1
      fs.writeFileSync(licensePath, JSON.stringify(licenseObj))
    } catch (err) {
      console.log('Error', err)
    }

    return { isLicensedExpired: false }
  },
  updateLicense(fieldName, value) {
    try {
      const licenseObj = this._readLicense()
      licenseObj[fieldName] = value;
      fs.writeFileSync(licensePath, JSON.stringify(licenseObj))

    } catch (err) {
      console.log('Error', err)
    }
  }
}