import api from '../index'

const esprops = {

  // 获取es配置
  getConf: () => api.get('get', {
    baseURL: '/ec/conf/',
  }),

  // 添加es配置
  addConf: (data: {
    name: string
    version: string
    address: string
    username: string
    password: string
    selected: boolean
  }) => api.post('add', data, {
    baseURL: '/ec/conf/',
  }),

  // 删除es配置
  delConf1: (name: string) => api.post(`del?name=${name}`, name, {
    baseURL: '/ec/conf/',
    params: { name },
  }),

  delConf: (name: string) => {
    const url = `del?name=${name}`
    return api.post(url, name, {
      baseURL: '/ec/conf/',
    })
  },

  // 设置es配置
  useConf: (data: {
    name: string
    version: string
    address: string
    username: string
    password: string
    selected: boolean
  }) => api.post('use', data, {
    baseURL: '/ec/conf/',
  }),
}

export default esprops
