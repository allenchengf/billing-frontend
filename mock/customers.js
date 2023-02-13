/**
 * @type {import('@/models').CustomerModel[]}
 */
const data = [
  {
    'id': 1,
    'customer_name': 'KZ',
    'customer_id': 'H1019',
    'customer_property': 'Terminated',
    'am': 'Brian',
    'description': null,
    'created_at': '2020-07-02T01:54:31+08:00',
    'updated_at': '2022-04-23T07:30:18+08:00'
  },
  {
    'id': 7,
    'customer_name': 'abc',
    'customer_id': 'H1004',
    'customer_property': 'Terminated',
    'am': '333',
    'description': 'ggg',
    'created_at': '2023-02-11T22:00:17+08:00',
    'updated_at': '2023-02-11T22:00:17+08:00'
  },
  {
    'id': 8,
    'customer_name': 'abc',
    'customer_id': 'H1005',
    'customer_property': 'Terminated',
    'am': '333',
    'description': 'ggg',
    'created_at': '2023-02-11T22:00:21+08:00',
    'updated_at': '2023-02-11T22:00:21+08:00'
  },
  {
    'id': 9,
    'customer_name': 'abc',
    'customer_id': 'H999',
    'customer_property': 'Terminated',
    'am': '333',
    'description': 'ggg',
    'created_at': '2023-02-11T22:26:12+08:00',
    'updated_at': '2023-02-11T22:28:19+08:00'
  }
]

module.exports = [
  {
    url: '/customers/',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data
      }
    }
  }
]
