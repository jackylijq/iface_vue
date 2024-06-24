const interfaceRouter = [
  {
    type: 'view', // 类型: folder, tab, view
    title: '接口管理',
    name: Symbol('interface-list'),
    route: '/interface/list',
    filePath: 'view/interface/interface-list.vue',
    inNav: true,
    icon: 'el-icon-cpu',
    order: 1,
  },
]

export default interfaceRouter
