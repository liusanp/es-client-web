import api from '../index'

const essearch = {

  // 获取es索引
  getIndices: () => api.get('getIndices', {
    baseURL: '/ec/es/',
  }),

  // 获取es索引mappings
  getMappings: (name: string) => api.get(`getMappings?index=${name}`, {
    baseURL: '/ec/es/',
  }),

  queryES: data => api.post('queryES', data, {
    baseURL: '/ec/es/',
  }),

  exportES: data => api.post('exportES', data, {
    baseURL: '/ec/es/',
  }),

}

export default essearch
