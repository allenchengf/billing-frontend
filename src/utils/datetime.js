import dayjs from 'dayjs'

/**
 * @return {string}
 */
export function createNow() {
  return dayjs().format('YYYY/MM/DD HH:mm:ss')
}

/**
 * @param {string | number | Date} time
 * @param {string} [format="YYYY-MM-DD HH:mm:ss"]
 * @return {string}
 */
export function parseTime(time, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(time).format(format)
}
