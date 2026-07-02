import request from '@/utils/request'

export function getUserAiApiKeys(params) {
  return request({
    url: '/v1/user-ai-api-keys',
    method: 'get',
    params
  })
}

export function createUserAiApiKey(data) {
  return request({
    url: '/v1/user-ai-api-keys',
    method: 'post',
    data,
    timeout: 15000
  })
}

export function updateUserAiApiKey(id, data) {
  return request({
    url: `/v1/user-ai-api-keys/${id}`,
    method: 'put',
    data
  })
}

export function batchDeleteUserAiApiKeys(data) {
  return request({
    url: '/v1/user-ai-api-keys/batch-delete',
    method: 'post',
    data
  })
}
