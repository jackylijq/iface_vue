const atomicCasesRouter = [
  {
    title: '原子用例',
    type: 'view',
    name: Symbol('atomiccase-list'),
    route: '/atomiccase/list',
    filePath: 'view/atomicCases/atomic-cases-list.vue',
    inNav: true,
    icon: 'iconfont icon-iconset0103',
    order: 2,
  },
  {
    title: '原子用例创建',
    type: 'view',
    name: Symbol('atomiccase-add'),
    activePath: '/atomiccase/list',
    route: '/atomiccase/add',
    filePath: 'view/atomicCases/atomic-cases-addnew.vue',
    inNav: false,
    icon: 'iconfont icon-iconset0103',
    order: 2,
  },
  {
    title: '原子用例编辑',
    type: 'view',
    name: Symbol('atomiccase-edit'),
    activePath: '/atomiccase/list',
    route: '/atomiccase/edit',
    filePath: 'view/atomicCases/atomic-cases-editnew.vue',
    inNav: false,
    icon: 'iconfont icon-iconset0103',
    order: 2,
  },
]

export default atomicCasesRouter
