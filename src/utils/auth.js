import { getStorage, setStorage, removeStorage } from './storage'

const TokenKey = 'ADMIN_TOKEN'

export function getToken() {
  return getStorage(TokenKey)
}

export function setToken(token) {
  return setStorage(TokenKey, token)
}

export function removeToken() {
  return removeStorage(TokenKey)
}
