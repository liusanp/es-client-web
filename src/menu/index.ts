import SysManager from './modules/sys.manager'
import EsSearch from './modules/es.search'

import type { Menu } from '#/global'

const menu: Menu.recordMainRaw[] = [
  {
    meta: {
      title: 'es-client-web',
      icon: 'uim:box',
    },
    children: [
      EsSearch,
      SysManager,
    ],
  },
]

export default menu
