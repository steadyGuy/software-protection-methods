module.exports = {
  generateKey(key, plainText) {
    const [keyLen, textLen] = [key.length, plainText.length]

    if (keyLen > textLen) {
      key = key.slice(0, textLen)
    } else if (keyLen < textLen) {
      key = key.repeat(Math.ceil(textLen / keyLen)).slice(0, textLen)
    }

    return key.toUpperCase()
  },
  encrypt(plainText, key) {
    const text = plainText.toUpperCase()
    let encryptedText = ""

    text.split('').forEach((char, idx) => {
      // we are working only with A-Z symbols
      // if we want to use a-z and numbers, then we need to
      // expand vigenere table, but I think A-Z will be quite enough
      const encryptedChar = (char.charCodeAt() + key[idx].charCodeAt()) % 26
      encryptedText += String.fromCharCode(encryptedChar + 'A'.charCodeAt())
    })

    return encryptedText
  },
  decrypt(encryptedText, key) {
    const text = encryptedText.toUpperCase()
    let originalText = ""

    text.split('').forEach((char, idx) => {
      const decryptedChar = (char.charCodeAt() - key[idx].charCodeAt() + 26) % 26
      originalText += String.fromCharCode(decryptedChar + 'A'.charCodeAt())
    })

    return originalText
  }
}