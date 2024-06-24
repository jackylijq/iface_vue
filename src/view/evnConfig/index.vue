<template>
  <div class="env-config">
    <treeTable
      ref="refTreeTable"
      :treeConfig="treeConfig"
      :searchConfig="searchConfig"
      :pageConfig="computedPageConfig"
      @create="btnCreate"
      @current-change="currentChange"
      @size-change="sizeChange"
    >
      <template #treeOperate="{ node, data }">
        <treeOpearte :node="node" :data="data" @refresh-group="handleRefreshGroup" @remove-group="handleRefreshGroup" />
      </template>

      <template #prepend>
        <el-select v-model="searchType" style="width: 100px">
          <el-option label="环境名称" value="env_name" />
          <el-option label="环境地址" value="env_host" />
        </el-select>
      </template>

      <template #table>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column :show-overflow-tooltip="true" prop="id" label="用例编号" width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="branch" label="环境编码" width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="env_name" label="环境名称" width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="env_host" label="环境地址" width="130px" />
          <el-table-column :show-overflow-tooltip="true" prop="com_header_string" label="请求头" />
          <el-table-column :show-overflow-tooltip="true" prop="oauth_type" label="鉴权模式" width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="oauth_value_string" label="鉴权值" />
          <el-table-column :show-overflow-tooltip="true" prop="num" label="产品数量" width="100px" />
          <el-table-column prop="address" label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button size="small" @click.stop="editClick(scope)">编辑</el-button>
              <el-button type="danger" size="small" @click.stop="delClick(scope)">删除</el-button>
              <!-- <el-button size="small" type="" @click="toRecord(scope)">测试记录</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </template>
    </treeTable>
  </div>
</template>
<script setup>
import { computed, nextTick, onActivated, provide, ref, unref } from 'vue'
import axios from '@/lin/plugin/axios'
import treeTable from '@/component/base/treeTable/treeTable.vue'
import treeOpearte from './treeOpearte.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '../../router'
import { getProductData } from './api'

let groupType = 'env'
provide('group_type', groupType)

let treeConfig = ref({
  data: [],
  currentNodeKey: '-1',
  nodeKey: 'id',
  'default-expand-all': true,
  draggable: false,
  props: { isLeaf: 'leaf' },
  'allow-drag'(node) {
    return node.data.id !== '-1'
  },
  'allow-drop'(node) {
    return node.data.id !== '-1'
  },
  nodeClickFn(data, node) {
    pageConfig.curPage = 1
    pageConfig.pageSize = 10
    tableParams.value =
      data.id === '-1'
        ? {}
        : {
            group_id: data.otherData.id,
          }
    getListData()
  },

  onNodeDrop(node, goalNode, position, event) {
    let newParentId = goalNode.data.id
    let newData = { ...unref(node.data.otherData), parents_id: newParentId }
    axios({
      method: 'post',
      url: '/iftest/condition/group/modify',
      data: newData,
    }).then(res => {
      ElMessage({
        type: res.code === 200 ? 'success' : 'error',
        message: res.message,
      })
      handleRefreshGroup()
    })
  },
})
async function loadTreeData() {
  let res = await axios({
    method: 'post',
    url: '/iftest/condition/group/list',
    data: {
      pro_line_id: 1,
      group_type: groupType,
    },
  })

  return [
    { id: '-1', label: '全部', leaf: true, otherData: { id: '-1' } },
    ...res.data.datasList.map(v => ({
      parentId: v.parents_id,
      id: `${v.id}`,
      label: v.group_name,
      leaf: false,
      otherData: v,
    })),
  ]
}

let refTreeTable = ref()
function setTreeHighlight() {
  nextTick(() => {
    let currentId = unref(refTreeTable).$refs.refComTree.myTree.getCurrentKey()
    if (!currentId) {
      currentId = '-1'
    }
    unref(refTreeTable).$refs.refComTree.myTree.setCurrentKey(currentId)
  })
}

function buildTree(list, parentId = 0) {
  let newArr = []
  list.forEach(item => {
    if (item.parentId == parentId) {
      item.children = buildTree(list, item.id)
      newArr.push(item)
    }
  })

  return newArr
}

async function handleRefreshGroup() {
  treeConfig.value.data = [
    { id: '-1', label: '全部', leaf: true, otherData: { id: '-1' } },
    ...buildTree(await loadTreeData()),
  ]
  setTreeHighlight()
}

handleRefreshGroup()

let searchString = ref('')
let searchType = ref('env_name')
let searchConfig = ref({
  buttonList: [
    {
      label: '创建',
      config: {
        type: 'primary',
      },
      emit: 'create',
    },
  ],
  query(v) {
    searchString.value = v
    tableParams.value[unref(searchType)] = v || undefined
    setTreeHighlight()
    getListData()
  },
  refresh() {
    pageConfig.value.curPage = 1
    pageConfig.value.pageSize = 10
    tableParams.value = {}
    treeConfig.value.currentNodeKey = ''
    setTimeout(() => {
      treeConfig.value.currentNodeKey = '-1'
    }, 0)
    setTreeHighlight()
    getListData()
  },
})
const totalConfig = ref(0)
let tableData = ref([])
let tableParams = ref({
  env_name: '',
  env_host: '',
})

const pageConfig = ref({
  curPage: 1,
  pageSize: 10,
})

const computedPageConfig = computed(() => ({
  currentPage: unref(pageConfig).curPage,
  pageSize: unref(pageConfig).pageSize,
  total: unref(totalConfig),
}))

/**
 * @todo 和树联动
 */
const getListData = async function (params = {}) {
  const res = await axios({
    method: 'post',
    url: '/iftest/condition/env/list',
    data: {
      ...tableParams.value,
      ...params,
      curPage: 1,
      pageSize: 10,
      ...pageConfig.value,
    },
  })

  let { datasList, curPage, pageSize, total } = res.data

  tableData.value = datasList.map(v => ({
    ...v,
    com_header_string: v.com_header ? JSON.stringify(v.com_header) : '',
    oauth_value_string: v.oauth_value ? JSON.stringify(v.oauth_value) : '',
  }))

  tableData.value.forEach(ele => {
    axios({
      method: 'post',
      url: '/iftest/condition/stroe/project_db',
      data: {
        branch: ele.branch,
      },
    }).then(res => {
      ele.num = res.data.datasList.length
    })
  })

  pageConfig.value = {
    curPage,
    pageSize,
  }
  totalConfig.value = total
}
getListData()

function editClick(scope) {
  router.push({
    path: '/evnConfig/edit',
    query: {
      ...unref(router.currentRoute).query,
      info: JSON.stringify(scope.row),
    },
  })
}
/**
 * 删除
 */
function delClick(scope) {
  ElMessageBox.confirm(`是否确认删除${scope.row.env_name}?`, '提示', {
    type: 'warning',
  }).then(async () => {
    let res = await axios({
      url: '/iftest/condition/env/del',
      method: 'POST',
      data: {
        branch: scope.row.branch,
        id: scope.row.id,
      },
    })
    ElMessage[res.code == 200 ? 'success' : 'error'](res.message)
    if (res.code == 200) {
      getListData()
    }
  })
}

const btnCreate = function () {
  router.push({ path: '/evnConfig/add', query: unref(tableParams) })
}

onActivated(() => {
  getListData()
})
const currentChange = function (v) {
  pageConfig.value.curPage = v
  getListData()
}

const sizeChange = function (v) {
  pageConfig.value.pageSize = v
  getListData()
}
</script>
<style lang="scss" scoped>
.env-config {
  height: 100%;
}
</style>
