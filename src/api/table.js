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
/**
 * @typedef {import('@/models').BillingSummaryModel} BillingSummaryModel
 */
/**
 * @typedef {import('@/models').BillingSummaryAggregatesModel} BillingSummaryAggregatesModel
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
 * @typedef {'customer_name'|'customer_id'|'customer_property'|'am'|'description'} CustomerUpdateColumn
 */

/**
 * @param {Pick<CustomerModel,CustomerUpdateColumn>} data
 * @returns {Promise<ResponseInfo<null>>}
 */
export function postCustomers(data) {
  return request({
    url: '/customers/',
    method: 'post',
    data
  })
}

/**
 * @param {number} id
 * @param {Pick<CustomerModel,CustomerUpdateColumn>} data
 * @returns {Promise<ResponseInfo<null>>}
 */
export function putCustomers(id, data) {
  return request({
    url: '/customers/' + id,
    method: 'put',
    data
  })
}

/**
 * @param {number} id
 * @returns {Promise<ResponseInfo<null>>}
 */
export function deleteCustomers(id) {
  return request({
    url: '/customers/' + id,
    method: 'delete'
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

/**
 * @typedef {'customer_id'|'description'|'poc'|'product'|'service_id'|'status'} SubscriptionUpdateColumn
 */

/**
 * @param {Pick<SubscriptionModel,SubscriptionUpdateColumn>} data
 * @returns {Promise<ResponseInfo<null>>}
 */
export function postSubscriptions(data) {
  return request({
    url: '/subscriptions/',
    method: 'post',
    data
  })
}

/**
 * @param {number} id
 * @param {Pick<SubscriptionModel,SubscriptionUpdateColumn>} data
 * @returns {Promise<ResponseInfo<null>>}
 */
export function putSubscriptions(id, data) {
  return request({
    url: '/subscriptions/' + id,
    method: 'put',
    data
  })
}

/**
 * @param {number} id
 * @returns {Promise<ResponseInfo<null>>}
 */
export function deleteSubscriptions(id) {
  return request({
    url: '/subscriptions/' + id,
    method: 'delete'
  })
}

/**
 * @returns {Promise<ResponseInfo<BillingSummaryModel[]>>}
 */
export function getBillingSummary() {
  return request({
    url: '/billing-summary/',
    method: 'get'
  })
}

/**
 * @typedef {'percentile_mbps_98'} BillingSummaryUpdateColumn
 */

/**
 * @param {number} id
 * @param {Pick<BillingSummaryModel,BillingSummaryUpdateColumn>} data
 * @returns {Promise<ResponseInfo<null>>}
 */
export function putBillingSummary(id, data) {
  return request({
    url: '/billing-summary/' + id,
    method: 'put',
    data
  })
}

/**
 * @param {number} id
 * @returns {Promise<ResponseInfo<null>>}
 */
export function deleteBillingSummary(id) {
  return request({
    url: '/billing-summary/' + id,
    method: 'delete'
  })
}

/**
 * @returns {Promise<ResponseInfo<BillingSummaryAggregatesModel[]>>}
 */
export function getBillingSummaryAggregates() {
  return request({
    url: '/billing-summary-aggregates/',
    method: 'get'
  })
}
