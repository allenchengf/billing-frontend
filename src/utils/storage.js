import localForage from 'localforage'
// import Cookies from 'js-cookie'

export function getStorage(key) {
  return localForage.getItem(key)
}

export function setStorage(key, value) {
  return localForage.setItem(key, value)
}

export function removeStorage(key) {
  return localForage.removeItem(key)
}
