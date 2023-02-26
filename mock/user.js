const { rawHeadersToJson } = require('./utils')

const tokens = {
  rdadmin: {
    password: '1qaz@WSX',
    data: {
      pk: 1676172957,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJkYWRtaW4iLCJpYXQiOjE2NzYxNzI5NTcsImV4cCI6MTY3NjI1OTM1NywianRpIjoiNmRhYjlhY2UtNzU0Zi00MWM5LTljNTYtMGYzMTYwMmI3Y2JlIiwidXNlcl9pZCI6MSwib3JpZ19pYXQiOjE2NzYxNzI5NTd9.hhEJZMlnTxob90kLBlKgaRUmwSwbQ7XvKmLwsOv6y_Q'
    }
  }
}

const users = {
  [tokens.rdadmin.data.token]: {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  }
}

module.exports = [
  {
    url: '/token-auth/',
    type: 'post',
    response: config => {
      const { username, password } = config.body
      try {
        if (tokens[username].password !== password) {
          throw new Error('Account and password are incorrect.')
        }
        return {
          code: 20000,
          data: tokens[username].data
        }
      } catch (error) {
        return {
          code: 40100,
          data: null,
          message: 'Account and password are incorrect.'
        }
      }
    }
  },
  {
    url: '/user/',
    type: 'get',
    response: config => {
      const headers = rawHeadersToJson(config.rawHeaders)
      const token = headers['Authorization']
      if (token) {
        return {
          code: 20000,
          data: users[token.split(' ')[1]]
        }
      } else {
        return {
          code: 40100,
          message: 'Login failed, unable to get user details.',
          data: null
        }
      }
    }
  },
  // user logout
  {
    url: '/logout/',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
