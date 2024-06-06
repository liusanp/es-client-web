import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const sysRoutes: RouteRecordRaw = {
  path: '/sys_manager',
  component: Layout,
  redirect: '/sys_manager/linkprops',
  name: 'sysManager',
  meta: {
    title: '系统管理',
    icon: 'i-heroicons-solid:menu-alt-3',
  },
  children: [
    {
      path: 'linkprops',
      name: 'linkprops',
      component: () => import('@/views/sys_manager/linkprops.vue'),
      meta: {
        title: '连接配置',
      },
    },
  ],
}

export default sysRoutes
