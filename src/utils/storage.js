import localForage from 'localforage'
// import Cookies from 'js-cookie'

export function getStorage(key, callback) {
  localForage.getItem(key, callback)
}

export function setStorage(key, value, callback) {
  localForage.setItem(key, value, callback)
}

export function removeStorage(key, callback) {
  localForage.removeItem(key, callback)
}
