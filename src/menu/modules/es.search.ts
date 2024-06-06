import type { Menu } from '#/global'

const searchMenus: Menu.recordRaw = {
  meta: {
    title: 'ES查询',
    icon: 'heroicons-solid:menu-alt-3',
  },
  children: [
    {
      path: '/es_search/simple',
      meta: {
        title: '简单查询',
      },
    },
  ],
}

export default searchMenus
