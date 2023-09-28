const atomicCasesRouter = [
  {
    title: '原子用例',
    type: 'view',
    name: Symbol('atomiccase-list'),
    route: '/atomiccase/list',
    filePath: 'view/atomicCases/atomic-cases-list.vue',
    inNav: true,
    icon: 'el-icon-goods',
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
    icon: 'el-icon-goods',
    order: 2,
    meta:{
      keepAlive:true
    }
  },
  {
    title: '原子用例编辑',
    type: 'view',
    name: Symbol('atomiccase-edit'),
    activePath: '/atomiccase/list',
    route: '/atomiccase/edit',
    filePath: 'view/atomicCases/atomic-cases-editnew.vue',
    inNav: false,
    icon: 'el-icon-goods',
    order: 2,
    meta:{
      keepAlive:true
    }
  },
  {
    title: '原子用例详情',
    type: 'view',
    name: Symbol('atomiccase-detail'),
    activePath: '/atomiccase/list',
    route: '/atomiccase/detail',
    filePath: 'view/atomicCases/atomic-row-detail.vue',
    inNav: false,
    icon: 'iconfont icon-iconset0103',
    order: 2,
  },
  {
    title: '原子用例测试记录',
    name: Symbol('atomic-test-record'),
    activePath: '/atomiccase/list',
    route: '/atomiccase/record',
    filePath: 'view/testRecord/AtomicRecord.vue',
    inNav: false,
    icon: 'el-icon-goods',
    order: 2,
  }
]

export default atomicCasesRouter
