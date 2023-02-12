/**
 * @template T
 * @typedef {Object} ResponseInfo<T>
 * @property {T} data
 * @property {number} code
 * @property {string} message
 */
/**
 * @template T
 * @typedef {Object} ResponsePageInfo<T>
 * @property {T} data
 * @property {number} code
 * @property {string} message
 * @property {number} current_page
 * @property {number} per_page
 * @property {number} total
 */
/**
 * @template T
 * @typedef {Object} ElTableScope<T>
 * @property {number} $index
 * @property {object} column
 * @property {T} row
 */
/**
 * @typedef {Object} TokenData
 * @property {number} pk
 * @property {string} token
 */
/**
 * @typedef {Object} CustomerModel
 * @property {number} id
 * @property {string} customer_name
 * @property {string} customer_id
 * @property {string} customer_property
 * @property {string} am
 * @property {string} [description]
 * @property {string} created_at
 * @property {string} updated_at
 */
/**
 * @typedef {Object} SubscriptionModel
 * @property {number} id
 * @property {number} customer_id
 * @property {string} product
 * @property {string} service_id
 * @property {string} poc
 * @property {string} status
 * @property {string} description
 * @property {string} created_at
 * @property {string} updated_at
 */

export {}
