/**
 * @type {import('@/models').TokenData}
 */
const data = {
  'pk': 1676172957,
  'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJkYWRtaW4iLCJpYXQiOjE2NzYxNzI5NTcsImV4cCI6MTY3NjI1OTM1NywianRpIjoiNmRhYjlhY2UtNzU0Zi00MWM5LTljNTYtMGYzMTYwMmI3Y2JlIiwidXNlcl9pZCI6MSwib3JpZ19pYXQiOjE2NzYxNzI5NTd9.hhEJZMlnTxob90kLBlKgaRUmwSwbQ7XvKmLwsOv6y_Q'
}

module.exports = [
  {
    url: '/api/v1/token-auth/',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data
      }
    }
  }
]
