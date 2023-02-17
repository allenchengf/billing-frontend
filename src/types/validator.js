
/**
 * @typedef {Object} ValidatorOption
 * @property {string} [type]
 * @property {boolean} [required]
 * @property {string | () => string} [message]
 * @property {RegExp} [pattern]
 * @property {string[]} [enum]
 * @property {number} [len]
 * @property {(v: string) => string} [transform]
 * @property {RuleField} [fields]
 * @property {RuleOptions} [options]
 * @property {RuleValidator} [validator]
 */
/**
 * @callback RuleValidator
 * @param {ValidatorOption} rule
 * @param {*} value
 * @param {() => void} callback
 * @param {*} source
 * @param {RuleOptions} options
 * @return {string | string[] | false}
 */
/**
 * @typedef {ValidatorOption} Rule
 */
/**
 * @typedef {{ [key: string]: Rule }} RuleField
 */
/**
 * @typedef {Object} RuleOptions
 * @property {boolean} [suppressWarning]
 * @property {boolean} [first]
 * @property {boolean|string[]} [firstFields]
 */

export {}
