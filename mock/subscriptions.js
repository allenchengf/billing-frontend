/**
 * @type {import('@/models').SubscriptionModel[]}
 */
const data = [
  {
    'id': 2,
    'customer_id': 18,
    'product': 'uCDN',
    'service_id': 'CDN-220',
    'poc': 'Production',
    'status': 'In Use',
    'description': 'xxxccc',
    'created_at': '2023-02-12T00:57:30+08:00',
    'updated_at': '2023-02-12T00:58:22+08:00'
  }
]

module.exports = [
  {
    url: '/subscriptions/',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data
      }
    }
  }
]
