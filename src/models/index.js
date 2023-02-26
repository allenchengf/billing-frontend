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
/**
 * @typedef {Object} BillingSummaryModel
 * @property {number} id
 * @property {number} customer_id customer
 * @property {string} service_id subscription
 * @property {string} bw_prefix_id
 * @property {number} cir
 * @property {number} pir
 * @property {string} provision_at
 * @property {string} terminated_at
 * @property {SensorChannels[]} sensors
 */
/**
 * @typedef {Object} SensorChannels
 * @property {string} sensor_id
 * @property {string[]} prefix channel: "{prefix}_{in or out}"
 */
/**
 * @typedef {Object} SensorModel
 * @property {number} id
 * @property {string} name
 * @property {number} sensor_id
 */
/**
 * @typedef {{ [sensor_id: string]: string[] }} Channels
 */
export {}
