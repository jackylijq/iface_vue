<template>
  <div class="integration-cases-list">
    <tree-table
      :treeConfig="{ ...treeConfig, currentNodeKey, defaultExpandedKeys }"
      :searchConfig="searchConfig"
      :pageConfig="pageConfig"
      @create="handleCreate"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #table>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column :show-overflow-tooltip="false" prop="id" label="用例id" min-width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="case_title" label="集成用例名称" min-width="150px">
            <template #default="{ row }">
              <a style="color: #3963bc" @click="handleRowClick(row)">{{ row.case_title }}</a>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="case_desc" label="集成用例描述" min-width="250px" />
          <el-table-column :show-overflow-tooltip="true" prop="atom_case_num" label="原子用例数量" min-width="150px" />
          <el-table-column :show-overflow-tooltip="true" label="用例状态" min-width="120px">
            <template #default="{ row, column, $index }">
              <span :class="{ '--pass': row.case_status === 'pass', '--fail': row.case_status === 'failed' }">{{
                row.case_status_text
              }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="exe_result" label="执行结果" min-width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="edit_uid" label="更新人员" min-width="100px" />
          <!-- <el-table-column :show-overflow-tooltip="true" prop="update_time" label="更新时间" min-width="150px" />
          <el-table-column :show-overflow-tooltip="true" prop="exe_time" label="执行时间" min-width="150px" /> -->

          <el-table-column label="操作" width="370px">
            <template #default="scope">
              <el-button type="primary" text size="small" @click="handleTest(scope)">测试</el-button>
              <el-button size="small" @click="handleEdit(scope)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
              <el-button size="small" @click="handleCopy(scope)">复制</el-button>
              <el-button size="small" @click="toRecord(scope)">测试记录</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </tree-table>
  </div>
</template>
<script setup>
import treeTable from '@/component/base/treeTable/treeTable.vue'
import axios from '@/lin/plugin/axios'
import router from '../../router'
import { computed, onActivated, reactive, ref, unref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Utils from 'lin/util/util'

let currentNodeKey = ref('')
let defaultExpandedKeys = ref([])
let remark = ref('')

let treeConfig = unref({
  data: [],
  lazy: true,
  nodeKey: 'id',
  props: { isLeaf: 'leaf' },
  async load(node, resolve) {
    const { level } = node
    if (level === 0) {
      const res = await axios({
        method: 'post',
        url: '/iftest/condition/group/list',
        data: {
          project_line_id: 1,
          parents_id: 0,
          group_type: 'scene',
        },
      })
      const nodeData = [
        { id: '-1', label: '全部', otherData: { id: '-1' } },
        ...res.data.datasList.map(v => ({
          id: `${v.id}`,
          label: v.group_name,
          otherData: v,
        })),
      ]
      resolve(nodeData)

      getTableData()
      defaultExpandedKeys.value = [nodeData[0]?.id]
      currentNodeKey.value = nodeData[0]?.id
    } else if (level === 1) {
      const { id } = node.data.otherData
      if (id === '-1') {
        resolve([])
        return
      }
      const res = await axios({
        method: 'post',
        url: '/iftest/condition/group/list',
        data: {
          project_line_id: 1,
          parents_id: id,
          group_type: 'scene',
        },
      })
      resolve(
        res.data.datasList.map(v => ({
          id: `${v.id}`,
          label: v.group_name,
          otherData: v,
        })),
      )
    } else {
      resolve([])
    }
  },
  async nodeClickFn(data, node) {
    pageConfig.curPage = 1
    pageConfig.pageSize = 10
    const { level } = node
    // canCreate.value = level != 3
    console.log(data)
    if (level === 1) {
      if (data.id === '-1') {
        tableParams.value = {}
      } else {
        const res = await axios({
          method: 'post',
          url: '/iftest/condition/group/list',
          data: {
            project_line_id: 1,
            parents_id: data.id,
            group_type: 'scene',
          },
        })
        const childNodeId = []
        const { datasList } = res.data
        datasList.forEach(item => {
          childNodeId.push(item.id)
        })
        tableParams.value = {
          case_group_id: [data.otherData.id, ...childNodeId],
        }
      }
      currentNodeKey.value = data.otherData.id
    } else if (level === 2) {
      const { id: group_id, project_id } = data.otherData
      tableParams.value = {
        case_group_id: [ group_id ],
      }
      currentNodeKey.value = group_id
    }
    remark.value = data.label
    getTableData()
  },
})

// 搜索配置
let searchConfig = computed(() => ({
  buttonList: [
    {
      label: '新建集成用例',
      config: {
        type: 'primary',
        disabled: false,
      },
      emit: 'create',
    },
    // {
    //   label: '删除',
    //   config: {
    //     type: 'default',
    //     disabled: true,
    //   },
    //   emit: 'delete',
    // },
  ],
  query(v) {
    tableParams.value.case_title = v
    getTableData()
  },

  refresh() {
    tableParams.value = {}
    pageConfig.curPage = 1
    pageConfig.pageSize = 10
    getTableData()
  },
}))

let handleCreate = function () {
  // router.push({ path: '/integrationcases/add', query: { remark: unref(remark), group_id: unref(currentNodeKey) } })
  router.push({ path: '/integrationcases/added', query: { remark: unref(remark), group_id: unref(currentNodeKey) } })
}

/**
 * 编辑时处理数据，并跳转地址
 * @param {*} param0
 */
let handleEdit = function ({ row }) {
  let { atom_case_list, atom_case_detail, id, case_desc, case_group_id, remark, case_title, case_type, project_id } =
    row
  let caseData = {
    id,
    project_id,
    case_desc,
    case_group_id,
    remark,
    case_title,
    case_type,
  }
  if (typeof atom_case_detail === 'string') {
    atom_case_detail = JSON.parse(atom_case_detail)
  }
  caseData.items = (typeof atom_case_list === 'number' ? [atom_case_list] : atom_case_list.split(','))
    .map((v, i) => `${v}_${i}`)
    .map(v => {
      return {
        ...atom_case_detail[v],
        id: v.slice(0, v.lastIndexOf('_')),
      }
    })
  window.localStorage.setItem(`caseData-${row.id}`, JSON.stringify(caseData))
  // console.log(row, caseData)
  // return
  router.push({ path: '/integrationcases/edited', query: { id: row.id } })
  // router.push({ path: '/integrationcases/edit', query: { id: row.id } })
}
// 查看集成用例详情
const handleRowClick = row => {
  let { atom_case_list, atom_case_detail, id, case_desc, case_group_id, remark, case_title, case_type, project_id } =
    row
  let caseData = {
    id,
    project_id,
    case_desc,
    case_group_id,
    remark,
    case_title,
    case_type,
  }
  if (typeof atom_case_detail === 'string') {
    atom_case_detail = JSON.parse(atom_case_detail)
  }
  caseData.items = (typeof atom_case_list === 'number' ? [atom_case_list] : atom_case_list.split(','))
    .map((v, i) => `${v}_${i}`)
    .map(v => {
      return {
        ...atom_case_detail[v],
        id: v.slice(0, v.lastIndexOf('_')),
      }
    })
  window.localStorage.setItem(`caseData-${row.id}`, JSON.stringify(caseData))
  router.push({ path: '/integrationcases/detail', query: { id: row.id, noEdit: true } })
}

let handleTest = async function ({ row }) {
  let res = await axios({
    method: 'POST',
    url: '/iftest/case/execute/test',
    data: { plan_list: [], scene_list: [row.id], test_case: [], branch: 'test' },
  })
  if (res.code === 200) {
    router.push({ path: '/integrationcases/test', query: { scene_id: row.id, batch_id: res.batch_id } })
  } else {
    ElMessage({
      type: 'error',
      message: '测试失败，请重试',
    })
  }
}

let tableParams = ref({})
let tableData = ref([])

let pageConfig = reactive({
  curPage: 1,
  pageSize: 10,
  total: 0,
})

let getTableData = Utils.debounce(async function () {
  let { curPage, pageSize } = unref(pageConfig)
  let { case_group_id } = unref(tableParams)
  let data = {
    curPage,
    pageSize,
    ...unref(tableParams),
  }
  case_group_id === '-1' && delete data.case_group_id
  let res = await axios({
    method: 'post',
    url: '/iftest/case/scene/list',
    data,
  })

  tableData.value = res.data.datasList.map(v => ({
    ...v,
    case_status_text: v.case_status === 'pass' ? '测试成功' : v.case_status === 'failed' ? '测试失败' : '未测试',
  }))
  pageConfig.total = res.data.total
},300) 

// 删除操作
let handleDelete = function (scope) {
  let { id, case_title } = unref(scope.row)

  ElMessageBox.confirm(`确认删除 ${case_title}`, '提示', {}).then(async () => {
    let res = await axios({
      method: 'POST',
      url: '/iftest/case/scene/del',
      data: {
        id,
      },
    })
    ElMessage({
      type: res.code === 200 ? 'success' : 'error',
      message: res.message,
    })

    if (res.code === 200 && unref(tableData).length === 1 && pageConfig.curPage > 1) {
      pageConfig.curPage--
    }

    getTableData()
  })
}

const toRecord = scope => {
  console.log(scope.row)
  router.push({ path: '/integrationcases/record', query: { id: scope.row.id, case_title: scope.row.case_title } })
}

let handleCopy = scope => {
  let { id, case_title } = unref(scope.row)

  ElMessageBox.confirm(`确认复制 ${case_title}`, '提示', {}).then(async () => {
    let res = await axios({
      method: 'POST',
      url: '/iftest/case/scene/copy',
      data: {
        id,
      },
    })
    ElMessage({
      type: res.code === 200 ? 'success' : 'error',
      message: res.message,
    })

    getTableData()
  })
}

const currentChange = function (v) {
  pageConfig.curPage = v
  getTableData()
}

const sizeChange = function (v) {
  pageConfig.pageSize = v
  getTableData()
}

onActivated(() => {
  getTableData()
})

// onMounted(() => {
//   getTableData()
// })
</script>
<style lang="scss" scoped>
.integration-cases-list {
  height: inherit;
}
</style>
