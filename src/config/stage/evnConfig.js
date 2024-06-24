const interfaceRouter = [
  {
    type: 'view',
    title: '环境配置',
    name: Symbol('evnConfig'),
    route: '/evnConfig',
    filePath: 'view/evnConfig/index.vue',
    inNav: true,
    icon: 'el-icon-orange',
    order: 4,
  },
  {
    type: 'view',
    title: '环境配置创建',
    name: Symbol('evnConfig-add'),
    activePath: '/evnConfig',
    route: '/evnConfig/add',
    filePath: 'view/evnConfig/envAdd.vue',
    inNav: false,
    icon: 'el-icon-orange',
    order: 4,
    meta:{
      keepAlive:true
    }
  },
  {
    type: 'view',
    title: '环境配置编辑',
    name: Symbol('evnConfig-edit'),
    activePath: '/evnConfig',
    route: '/evnConfig/edit',
    filePath: 'view/evnConfig/envAdd.vue',
    inNav: false,
    icon: 'el-icon-orange',
    order: 4,
    meta:{
      keepAlive:true
    }
  },
]

export default interfaceRouter
