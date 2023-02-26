
/**
 * @typedef {Object} SensorModel
 * @property {number} id
 * @property {string} name
 * @property {number} sensor_id
 */
/**
 * @typedef {{ [sensor_id: string]: string[] }} Channels
 */
const { mock, Random } = require('mockjs')

const createIP = () => `${Random.integer(0, 255)}.${Random.integer(0, 255)}.${Random.integer(0, 255)}.${Random.integer(0, 255)}/${Random.integer(1, 24)}`
const inOrOut = () => Math.random() >= 0.5 ? 'in' : 'out'

const billing = mock({
  code: 20000,
  data: Array(100).fill().map((_, i) => {
    return {
      id: i + 1,
      customer_id: Random.integer(1, 999),
      service_id: Random.string('upper', 3) + '-' + Random.integer(1, 999),
      bw_prefix_id: Random.string(10),
      cir: Random.string(10),
      pir: Random.string(10),
      provision_at: '@datetime',
      terminated_at: '@datetime',
      sensors: new Array(10).fill().map((_, j) => {
        return {
          sensor_id: Random.integer(1, 100),
          prefix: Array(Random.integer(1, 10)).fill().map(p => createIP())
        }
      })
    }
  })
})

const sensor = mock({
  code: 20000,
  data: Array(100).fill().map((_, i) => {
    return {
      id: i + 1,
      name: Random.string(10),
      sensor_id: i + 1
    }
  })
})

const channels = mock(() => {
  const data = {}
  Array(100).fill().forEach((_, i) => {
    data[i + 1] = Array(10).fill().map(p => createIP() + '_' + inOrOut())
  })
  return {
    code: 20000,
    data
  }
})

module.exports = [
  {
    url: '/billing/',
    type: 'get',
    response: config => {
      return billing
    }
  },
  {
    url: '/sensors/',
    type: 'get',
    response: config => {
      return sensor
    }
  },
  {
    url: '/channels/',
    type: 'get',
    response: config => {
      return channels
    }
  }
]
