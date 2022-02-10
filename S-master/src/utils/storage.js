import CryptoJS from 'crypto-js'
// sessionStorage3个函数的封装同时加密
export const setItem = (name, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  const cipherText = CryptoJS.AES.encrypt(value, 'secretkey123').toString()
  window.sessionStorage.setItem(name, cipherText)
}

export const getItem = name => {
  // debugger
  const data = window.sessionStorage.getItem(name)
  if (data === null) {
    return ''
  }
  const bytes = CryptoJS.AES.decrypt(data, 'secretkey123')
  var originalText = bytes.toString(CryptoJS.enc.Utf8)
  try {
    return JSON.parse(originalText)
  } catch (err) {
    return originalText
  }
}

export const removeItem = name => {
  window.sessionStorage.removeItem(name)
}
