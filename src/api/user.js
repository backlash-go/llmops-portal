import request from '@/utils/request'

export function getInfo() {
  return request({
    url: '/v1/users/me',
    method: 'get',
    suppressErrorMessage: true
  })
}

export function logout() {
  return request({
    url: '/v1/logout',
    method: 'post'
  })
}
