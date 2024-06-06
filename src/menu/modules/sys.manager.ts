import type { Menu } from '#/global'

const sysMenus: Menu.recordRaw = {
  meta: {
    title: '系统管理',
    icon: 'heroicons-solid:menu-alt-3',
  },
  children: [
    {
      path: '/sys_manager/linkprops',
      meta: {
        title: '连接配置',
      },
    },
  ],
}

export default sysMenus
