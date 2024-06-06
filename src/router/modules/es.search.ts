import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const esRoutes: RouteRecordRaw = {
  path: '/es_search',
  component: Layout,
  redirect: '/es_search/simple',
  name: 'esSearch',
  meta: {
    title: 'ES查询',
    icon: 'i-heroicons-solid:menu-alt-3',
  },
  children: [
    {
      path: 'simple',
      name: 'simple',
      component: () => import('@/views/es_search/simple.vue'),
      meta: {
        title: '简单查询',
      },
    },
  ],
}

export default esRoutes
