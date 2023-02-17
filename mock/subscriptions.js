const { mock, Random } = require('mockjs')

/**
 * @type {import('@/models').SubscriptionModel[]}
 */
const res = mock({
  code: 20000,
  data: Array(100).fill().map((_, i) => {
    return {
      id: i + 1,
      customer_id: Random.integer(1, 999),
      poc: '@sentence(5)',
      'product|1': ['Production1', 'Production2', 'Production3', 'Production4'],
      service_id: Random.string('upper', 3) + '-' + Random.integer(1, 999),
      description: '@sentence(10)',
      'status|1': ['published', 'draft', 'deleted'],
      created_at: '@datetime',
      updated_at: '@datetime'
    }
  })
})

module.exports = [
  {
    url: '/subscriptions/',
    type: 'get',
    response: config => {
      return res
    }
  }
]
