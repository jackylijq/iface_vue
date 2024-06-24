const interfaceRouter = [
  {
    type: 'view', // 类型: folder, tab, view
    title: '概览',
    name: Symbol('overview'),
    route: '/overview',
    filePath: 'view/overview/overview.vue',
    inNav: true,
    icon: 'el-icon-view',
    order: 1,
  },
  {
    title: '已实现',
    name: Symbol('overview_finish'),
    activePath: '/overview',
    route: '/overview/finish',
    filePath: 'view/interface/interface-list.vue',
    inNav: false,
    icon: 'el-icon-view',
    order: 1,
  },
  {
    title: '未实现',
    name: Symbol('overview_unrealized'),
    activePath: '/overview',
    route: '/overview/unrealized',
    filePath: 'view/interface/interface-list.vue',
    inNav: false,
    icon: 'el-icon-view',
    order: 1,
  },
  {
    title: '已废弃',
    name: Symbol('overview_mesi'),
    activePath: '/overview',
    route: '/overview/finish_mesi',
    filePath: 'view/interface/interface-list.vue',
    inNav: false,
    icon: 'el-icon-view',
    order: 1,
  },
]

export default interfaceRouter
