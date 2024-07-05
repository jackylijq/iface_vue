<template>
  <div class="user-manage">
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
          <el-option label="用户名" value="username" />
          <el-option label="姓名" value="nickname" />
        </el-select>
      </template>

      <template #table>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column :show-overflow-tooltip="true" prop="id" label="ID" width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" />
          <el-table-column :show-overflow-tooltip="true" prop="nickname" label="姓名" />
          <el-table-column :show-overflow-tooltip="true" prop="pro_line_list_string" label="授权项目" />
          <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" />
          <el-table-column :show-overflow-tooltip="true" prop="update_time" label="更新时间" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click.stop="openDialogConnectProject(scope)">关联项目</el-button>

              <el-button type="danger" size="small" @click.stop="delClick(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </treeTable>

    <el-dialog v-model="userAddVisible" destroy-on-close title="创建用户" width="500">
      <user-add @submit="handleSubmitUserAdd" @cancel="userAddVisible = false"></user-add>
    </el-dialog>

    <el-dialog v-model="connectProjectVisiable" destroy-on-close title="关联项目" width="500">
      <project-connect
        :user_id="user_id"
        @submit="handleSubmitConnect"
        @cancel="connectProjectVisiable = false"
      ></project-connect>
    </el-dialog>
  </div>
</template>
<script setup>
import { computed, nextTick, onActivated, provide, ref, unref } from 'vue'
import axios from '@/lin/plugin/axios'
import treeTable from '@/component/base/treeTable/treeTable.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import treeOpearte from '../evnConfig/treeOpearte.vue'
import userAdd from './userAdd.vue'
import projectConnect from './projectConnect.vue'
import { getProjectData, getUserProjectData } from '../evnConfig/api'
let groupType = 'user'
provide('group_type', groupType)

let treeConfig = ref({
  data: [],
  currentNodeKey: '-1',
  nodeKey: 'id',
  'default-expand-all': true,
  props: { isLeaf: 'leaf' },
  nodeClickFn(data, node) {
    pageConfig.curPage = 1
    pageConfig.pageSize = 10

    tableParams.value =
      data.id === '-1'
        ? {}
        : {
            group_id: data.otherData.id,
          }
    getTableData()
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
let searchType = ref('username')
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
    getTableData()
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
    getTableData()
  },
})
let tableParams = ref({
  username: '',
  nickname: '',
})
let pageConfig = ref({
  curPage: 1,
  pageSize: 10,
})
let totalConfig = ref(0)
let tableData = ref([])

const computedPageConfig = computed(() => ({
  currentPage: unref(pageConfig).curPage,
  pageSize: unref(pageConfig).pageSize,
  total: unref(totalConfig),
}))

let userAddVisible = ref(false)
function btnCreate() {
  userAddVisible.value = true
}

/**
 * 获取列表
 */
async function getTableData(params = {}) {
  let projectData = (await getProjectData()).data.datasList

  let res = await axios({
    method: 'POST',
    url: '/cms/user/user_list',
    data: {
      ...tableParams.value,
      ...params,
      curPage: 1,
      pageSize: 10,
      ...pageConfig.value,
    },
  })
  let { datasList, curPage, pageSize, total } = res.data

  // 查询用户的项目
  tableData.value = datasList
  tableData.value.forEach(ele => {
    getUserProjectData(ele.id).then(res => {
      ele.pro_line_list = res.data.datasList[0]?.pro_line_list
      ele.pro_line_list_string = ele.pro_line_list.map(v => projectData.find(e => e.id === v).pro_line_name)
    })
  })

  pageConfig.value = {
    curPage,
    pageSize,
  }
  totalConfig.value = total
}
getTableData()

let connectProjectVisiable = ref(false)
let user_id = ref('')
function openDialogConnectProject(scope) {
  user_id.value = scope.row.id
  connectProjectVisiable.value = true
}

/**
 * 删除
 */
function delClick(scope) {
  ElMessageBox.confirm(`是否确认删除${scope.row.username}?`, '提示', {
    type: 'warning',
  }).then(async () => {
    let res = await axios({
      url: `/cms/admin/user/${scope.row.id}`,
      method: 'DELETE',
    })
    ElMessage[res.code == 200 ? 'success' : 'error'](res.message)
    if (res.code == 200) {
      getTableData()
    }
  })
}

async function handleSubmitConnect(form) {
  connectProjectVisiable.value = false
  let res = await axios({
    method: 'POST',
    url: '/iftest/product/userPLmodify',
    data: {
      user_id: unref(user_id),
      ...form,
    },
  })
  ElMessage({
    type: res.code === 200 ? 'success' : 'error',
    message: res.message,
  })
  userAddVisible.value = false
  // getTableData()
}

/**
 * 创建用户
 */
async function handleSubmitUserAdd(form) {
  let { group_id } = unref(tableParams)
  let res = await axios({
    method: 'POST',
    url: '/cms/user/register',
    data: { ...form, group_id, group_ids: [] },
  })
  ElMessage({
    type: res.code === 200 ? 'success' : 'error',
    message: res.message,
  })

  getTableData()
  userAddVisible.value = false
}

onActivated(() => {
  getTableData()
})
const currentChange = function (v) {
  pageConfig.value.curPage = v
  getTableData()
}

const sizeChange = function (v) {
  pageConfig.value.pageSize = v
  getTableData()
}
</script>
<style lang="scss" scoped>
.user-manage {
  height: 100%;
}
</style>
