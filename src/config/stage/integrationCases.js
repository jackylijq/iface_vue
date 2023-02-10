export default [
  {
    title: '集成用例',
    type: 'view',
    name: Symbol('integration-cases-list'),
    route: '/integrationcases/list',
    filePath: 'view/integrationCases/index.vue',
    inNav: true,
    icon: 'iconfont icon-iconset0103',
    order: 2,
  },
  {
    title: '新建集成用例',
    type: 'view',
    name: Symbol('integrationcases-add'),
    activePath: '/integrationcases/list',
    route: '/integrationcases/add',
    filePath: 'view/integrationCases/add.vue',
    inNav: false,
    icon: 'iconfont icon-iconset0103',
  },{
    title: '编辑集成用例',
    type: 'view',
    name: Symbol('integrationcases-add'),
    activePath: '/integrationcases/list',
    route: '/integrationcases/edit',
    filePath: 'view/integrationCases/add.vue',
    inNav: false,
    icon: 'iconfont icon-iconset0103',
  },
]