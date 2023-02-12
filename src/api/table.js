import request from '@/utils/request'

/**
 * @template T
 * @typedef {import('@/models').ResponseInfo<T>} ResponseInfo<T>
 */
/**
 * @typedef {import('@/models').CustomerModel} CustomerModel
 */
/**
 * @typedef {import('@/models').SubscriptionModel} SubscriptionModel
 */

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

/**
 * @returns {Promise<ResponseInfo<CustomerModel[]>>}
 */
export function getCustomers() {
  return request({
    url: '/customers/',
    method: 'get'
  })
}

/**
 * @returns {Promise<ResponseInfo<SubscriptionModel[]>>}
 */
export function getSubscriptions() {
  return request({
    url: '/subscriptions/',
    method: 'get'
  })
}
