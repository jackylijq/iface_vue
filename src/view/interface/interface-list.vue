<template>
  <div class="interface-list">
    <el-upload
      v-if="!computedImportDisabled"
      class="avatar-uploader el-button"
      accept="json"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleChange"
    >
      <!-- <el-icon class="avatar-uploader-icon"><Plus /></el-icon> -->
    </el-upload>

    <treeTable
      :treeConfig="{ ...treeConfig, defaultExpandedKeys, currentNodeKey }"
      :searchConfig="searchConfig"
      :pageConfig="computedPageConfig"
      :tabsData="tabsData"
      @current-change="currentChange"
      @size-change="sizeChange"
      ref="refTreeTable"
    >
      <template #treeOperate="{ node, data }">
        <interfaceTreeOperate
          :node="node"
          :data="data"
          @refresh-product="handleRefreshProduct(node)"
          @remove-product="handleRemoveProduct(node)"
          @refresh-group="handleRefreshGroup(node)"
          @remove-group="handleRemoveGroup(node)"
        />
      </template>
      <template #prepend>
        <el-select v-model="searchType" style="width: 100px" @change="typeChanged">
          <el-option label="接口地址" value="request_url" />
          <el-option label="接口名称" value="iface_name" />
        </el-select>
      </template>
      <template #table>
        <el-table stripe :data="tableData">
          <el-table-column :show-overflow-tooltip="true" prop="id" label="ID" width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="project_name" label="产品名称" min-width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="group_name" label="分组名称" min-width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="iface_name" label="接口名称" min-width="100px">
            <template #default="{ row }">
              <el-link link type="primary" :underline="false" @click="click_iface_name(row)">
                {{ row.iface_name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="request_url" label="接口地址" min-width="150px">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="atom_num" label="用例数量" width="100px">
            <template #default="{ row }">
              <el-link link type="primary" :underline="false" @click="click_atom_num(row)">
                {{ row.atom_num }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="scene_num" label="场景数量" width="100px">
            <template #default="{ row }">
              <el-link link type="primary" :underline="false" @click="click_scene_num(row)">
                {{ row.scene_num }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="260">
            <template #default="scope">
              <el-button v-if="scope.row.iface_status !== 1" size="small" type="primary" @click="createAtomic(scope)"
                >创建用例</el-button
              >
              <el-button type="danger" size="small" @click.stop="delClick(scope)">删除</el-button>
              <el-button
                :type="scope.row.iface_status === 1 ? 'success' : ''"
                size="small"
                @click="handleIgnore(scope)"
                >{{ scope.row.iface_status === 1 ? '恢复' : '废弃' }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template #view>
        <interface-detail :iface_id="detail_id"></interface-detail>
      </template>
    </treeTable>

    <interface-upload ref="refUpload" @closed="handleClosed" />
  </div>
</template>
<script setup>
import { ref, unref, computed, reactive, nextTick } from 'vue'
import treeTable from '@/component/base/treeTable/treeTableTab.vue'
import interfaceDetail from './interface-detail.vue'
import axios from '@/lin/plugin/axios'
import interfaceUpload from './interface-upload.vue'
import interfaceTreeOperate from './interface-tree-operate.vue'
import router from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { method } from 'lodash'
const detail_id = ref('')

const listShow = ref(true)
const detailShow = ref(false)
let tabsData = reactive([
  {
    label: '接口列表',
    slot: 'table',
    show() {
      return true
    },
  },
  {
    label: '接口详情',
    slot: 'view',
    show() {
      return detailShow.value
    },
  },
])

const treeNode = ref({})
const computedImportDisabled = computed(() => {
  return unref(treeNode).level !== 1 && unref(treeNode).data?.id !== '-1'
})

const handleClosed = function () {
  handleRefreshGroup(unref(treeNode))
}

const currentNodeKey = ref('')
const defaultExpandedKeys = ref([])
const projectData = ref([])
const totalConfig = ref(0)
let treeParams = ref({})
const tableData = ref([])
const pageConfig = ref({
  curPage: 1,
  pageSize: 10,
})
const computedPageConfig = computed(() => ({
  currentPage: unref(pageConfig).curPage,
  pageSize: unref(pageConfig).pageSize,
  total: unref(totalConfig),
}))

const setTreeHighLight = function () {
  return
}

const loadProductTreeData = async function () {
  let res = await axios({
    method: 'post',
    url: '/iftest/product/proList',
  })

  return [
    { id: '-1', label: '全部', leaf: true, otherData: { id: '-1' } },
    ...res.data.datasList.map(v => ({
      id: `${v.id}`,
      label: v.pro_name,
      otherData: v,
    })),
  ]
}

/**
 * 加载产品下的分组
 */
const loadGroupTreeData = async function (project_id) {
  const res = await axios({
    method: 'post',
    url: '/iftest/iface/group/list',
    data: {
      project_id,
    },
  })
  return res.data.datasList.map(v => ({
    id: `${project_id}-${v.id}`,
    label: v.group_name,
    otherData: v,
  }))
}

async function nodeClickFn(data, node) {
  treeNode.value = node
  pageConfig.value.curPage = 1
  pageConfig.value.pageSize = 10

  // 接口列表
  let [project_id, group_id, face_id] = data.id.split('-')
  group_id == 1 && (group_id = undefined)
  project_id === '' && (project_id = undefined)
  let { pro_line_id } = data.otherData

  detailShow.value = !!face_id
  detail_id.value = face_id

  if (detailShow.value) {
    nextTick(() => {
      unref(refTreeTable).handleClick({ index: 1 })
    })
  } else {
    treeParams.value = {
      project_id,
      group_id,
      face_id,
      pro_line_id,
    }
    getListData({
      project_id,
      group_id,
      face_id,
    })
    nextTick(() => {
      unref(refTreeTable).handleClick({ index: 0 })
    })
  }
}

const treeConfig = ref({
  data: [],
  lazy: true,
  nodeKey: 'id',
  props: { isLeaf: 'leaf' },
  async load(node, resolve) {
    const { level } = node
    if (level === 0) {
      let nodeData = await loadProductTreeData()
      // let { pro_id } = router.currentRoute.value.query
      // if (pro_id) {
      //   nodeData = nodeData.filter(v => v.id == pro_id)
      // }
      projectData.value = nodeData
      resolve(nodeData)
      defaultExpandedKeys.value = [nodeData[0]?.id]
      currentNodeKey.value = nodeData[0]?.id
    } else if (level === 1) {
      const { id: project_id } = node.data.otherData
      if (project_id === '-1') {
        resolve([])
        return
      }

      let res = await loadGroupTreeData(project_id)
      resolve(res)
      setTreeHighLight()
    } else if (level === 2) {
      const { id: group_id, project_id } = node.data.otherData
      const res = await axios({
        method: 'post',
        url: '/iftest/iface/iface_list',
        data: {
          group_id,
          project_id,
          curPage: 1,
          pageSize: 1000,
        },
      })
      resolve(
        res.data.datasList.map(v => ({
          id: `${project_id}-${group_id}-${v.id}`,
          label: v.iface_name,
          leaf: true,
          otherData: v,
        })),
      )
      setTreeHighLight()
    } else {
      resolve([])
    }
  },

  nodeClickFn,
})

const refTreeTable = ref()

// 查找当前应该高亮node（上一次-->上一次父级-->...-->全部）
function getParentId(node) {
  let idList = node.data.id.split('-')
  let parentIndex = idList.indexOf(String(node.data.otherData.id)) - 1
  return idList[parentIndex]
}

// 设置树高亮并自动搜索接口列表
function setTreeHighlight(node) {
  let currentId = unref(refTreeTable).$refs.refComTree.myTree.getCurrentKey()
  if (!currentId) {
    currentId = getParentId(node) || '-1'
  }
  nextTick(() => {
    unref(refTreeTable).$refs.refComTree.myTree.setCurrentKey(currentId)

    if (currentId !== '-1') {
      let node = unref(refTreeTable).$refs.refComTree.myTree.getNode(currentId)
      let [project_id, group_id, face_id] = node.data.id.split('-')
      getListData({
        project_id,
        group_id,
        face_id,
      })
    } else {
      getListData()
    }
  })
}

/**
 * 刷新产品
 */
const handleRefreshProduct = async function (node) {
  const nodeData = await loadProductTreeData()
  projectData.value = nodeData
  treeConfig.value.data = nodeData
  setTreeHighlight(node)
}

const getLevelOne = function (node) {
  if (node.level === 1) {
    return node
  } else {
    return getLevelOne(node.parent)
  }
}

/**
 * 刷新分组
 */
const handleRefreshGroup = async function (node) {
  let nodeOne = getLevelOne(node)
  const groupData = await loadGroupTreeData(nodeOne.data.id)
  nodeOne.childNodes = []
  nodeOne.data.children = groupData
  setTreeHighlight(node)
}

// 删除产品
const handleRemoveProduct = function (node) {
  unref(refTreeTable).$refs.refComTree.myTree.remove(node)
  setTreeHighlight(node)
}

// 删除分组
const handleRemoveGroup = function (node) {
  unref(refTreeTable).$refs.refComTree.myTree.remove(node)
  setTreeHighlight(node)
}

let tableParams = ref({
  iface_name: '',
  request_url: '',
})

const getListData = async function (params = {}) {
  // 判断type
  let { listUrl, pro_id, iface_status } = router.currentRoute.value.query
  let data = {
    iface_status,
    pro_id,
    ...tableParams.value,
    ...params,
    curPage: 1,
    pageSize: 10,
    ...pageConfig.value,
  }

  if (iface_status) {
    delete data.pro_id
    data.project_id = pro_id
  }

  const res = await axios({
    method: 'post',
    url: listUrl || '/iftest/iface/iface_list',
    data,
  })

  let { datasList, curPage, pageSize, total } = res.data
  pageConfig.value = {
    curPage,
    pageSize,
  }
  totalConfig.value = total

  // 查询分组名
  const groupRes = await axios({
    method: 'post',
    url: '/iftest/iface/group/list',
    data: {
      id: datasList.map(v => v.group_id),
    },
  })

  datasList = datasList.map(v => {
    let { label: project_name } = projectData.value.find(e => e.id == v.project_id) || {}
    let { group_name } = groupRes.data.datasList.find(e => e.id == v.group_id) || {}
    return {
      ...v,
      project_name,
      group_name,
    }
  })
  tableData.value = datasList
}
getListData()

const currentChange = function (v) {
  pageConfig.value.curPage = v
  getListData(unref(treeParams))
}

const sizeChange = function (v) {
  pageConfig.value.pageSize = v
  getListData(unref(treeParams))
}

let searchString = ref('')
const searchType = ref('iface_name')
const searchConfig = computed(() => ({
  buttonList: [
    {
      label: '导入',
      config: {
        type: 'primary',
        disabled: computedImportDisabled.value,
      },
      emit: 'import',
    },
  ],
  query(v) {
    searchString.value = v
    tableParams.value = {}
    tableParams.value[unref(searchType)] = v || undefined

    currentNodeKey.value = ''
    setTimeout(() => {
      currentNodeKey.value = '-1'
    }, 0)

    // TODO: 根据搜索类型调整表格

    getListData()
  },

  refresh() {
    pageConfig.value.curPage = 1
    pageConfig.value.pageSize = 10
    tableParams.value = {}
    currentNodeKey.value = ''
    setTimeout(() => {
      currentNodeKey.value = '-1'
    }, 0)
    getListData()
  },
}))

// 切换搜索类型
const typeChanged = function () {
  console.log(unref(searchType))
}

const refUpload = ref()
const handleChange = function (file) {
  let reader = new FileReader()
  reader.onload = function () {
    let res = this.result
    refUpload.value.uploadBatch(JSON.parse(res), unref(treeParams))
  }

  reader.readAsText(file.raw)
}

// 点击接口名称
const click_iface_name = function (row) {
  detail_id.value = row.id
  detailShow.value = true
  refTreeTable.value.handleClick({ index: 1 })
}

const click_atom_num = function ({ project_id, group_id, id }) {
  router.push({
    path: '/atomiccase/list',
    query: {
      project_id,
      group_id,
      iface_id: id,
    },
  })
}

async function click_scene_num({ id, group_id, project_id, atom_num }) {
  // 查询原子用例
  let res = await axios({
    url: '/iftest/case/standStom/list',
    method: 'POST',
    data: {
      project_id,
      group_id,
      iface_id: id,
      curPage: 1,
      pageSize: atom_num,
    },
  })

  router.push({
    path: '/atomiccase/integrationRelation',
    query: {
      relation: true,
      id: res.data.datasList.map(v => v.id).join(','),
    },
  })
}

// 创建用例
function createAtomic(scope) {
  let { project_id, id: iface_id, group_id, pro_line_id } = scope.row
  router.push({
    path: '/atomiccase/add',
    query: {
      project_id,
      iface_id,
      group_id,
    },
  })
}

function delClick(scope) {
  ElMessageBox.confirm(`是否确认删除${scope.row.iface_name}? <br> <span>会同步删除当前接口的原子用例</span>`, '提示', {
    type: 'warning',
    dangerouslyUseHTMLString: true,
  }).then(async () => {
    let res = await axios({
      url: '/iftest/iface/iface_del',
      method: 'POST',
      data: {
        id: scope.row.id,
      },
    })
    ElMessage[res.code == 200 ? 'success' : 'error'](res.message)
    if (res.code == 200) {
      getListData()
    }
  })
}

function handleIgnore(scope) {
  ElMessageBox.confirm(`是否确认${scope.row.iface_status === 1 ? '恢复' : '废弃'}${scope.row.iface_name}?`, '提示', {
    type: 'warning',
  }).then(async () => {
    let res = await axios({
      url: '/iftest/iface/iface_ignore',
      method: 'POST',
      data: {
        iface_status: scope.row.iface_status === 1 ? 0 : 1,
        id: scope.row.id,
      },
    })
    ElMessage[res.code == 200 ? 'success' : 'error'](res.message)
    if (res.code == 200) {
      getListData()
    }
  })
}
</script>
<style lang="scss" scoped>
.interface-list {
  height: 100%;
  position: relative;
}

.avatar-uploader {
  padding: 0;
  position: absolute;
  background: transparent;
  border: none;
  top: 62px;
  left: 210px;
  width: 62px;
  height: 32px;
  z-index: 10;

  &:hover {
    background: transparent !important;
    border: none !important;
  }

  ::v-deep .el-upload {
    width: 100%;
    height: 100%;
  }
}
</style>
