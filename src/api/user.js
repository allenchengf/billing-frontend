import request from '@/utils/request'

/**
 * @template T
 * @typedef {import('@/models').ResponseInfo<T>} ResponseInfo<T>
 */
/**
 * @typedef {import('@/models').TokenData} TokenData
 */

/**
 * @typedef {Object} LoginParam
 * @property {string} username
 * @property {string} password
 */
/**
 * @param {LoginParam} data
 * @return {Promise<ResponseInfo<TokenData>>>}
 */
export function login(data) {
  return request({
    url: '/token-auth/',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/user/',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout/',
    method: 'post'
  })
}
