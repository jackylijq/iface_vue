<template>
  <div class="test-plans">
    <tree-table
      :treeConfig="{ ...treeConfig, currentNodeKey, defaultExpandedKeys }"
      :searchConfig="searchConfig"
      :pageConfig="pageConfig"
      @size-change="sizeChange"
      @current-change="currentChange"
      @exec="handleExec(selection)"
      @create="handleCreate"
    >
      <template #table>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column :show-overflow-tooltip="false" prop="id" label="计划id" width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="plan_title" label="计划名称" min-width="150px" />
          <el-table-column :show-overflow-tooltip="true" prop="scene_case_num" label="用例数量" />
          <!-- <el-table-column :show-overflow-tooltip="true" prop="atom_case_num" label="原子用例数" /> -->
          <el-table-column :show-overflow-tooltip="true" prop="edit_uid" label="创建人员" />
          <!-- <el-table-column :show-overflow-tooltip="true" prop="exe_result" label="执行结果" /> -->
          <!-- <el-table-column :show-overflow-tooltip="true" prop="exe_env" label="执行环境" /> -->
          <el-table-column :show-overflow-tooltip="true" prop="update_time" label="创建时间" width="250px" />
          <el-table-column label="操作" width="300">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
              <el-button type="primary" text size="small" @click="handleExec([scope.row])">执行</el-button>
              <el-button type="primary" text size="small" @click="handleDelete(scope)">删除</el-button>
              <el-button type="danger" text size="small" @click="routeToResult(scope)">结果查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </tree-table>
  </div>
</template>
<script setup>
import { computed, h, onMounted, reactive, ref, unref } from 'vue'
import axios from '@/lin/plugin/axios'
import treeTable from '@/component/base/treeTable/treeTable.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DialogExec from './dialogExec.vue'
import router from '../../router'

let currentNodeKey = ref('')
let defaultExpandedKeys = ref([])

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
          group_type: 'plan',
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
          group_type: 'plan',
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
  nodeClickFn(data, node) {
    pageConfig.curPage = 1
    pageConfig.pageSize = 10
    const { level } = node
    // canCreate.value = level != 3
    if (level === 1) {
      tableParams.value = {
        group_id: data.otherData.id === '-1' ? undefined : data.otherData.id,
      }
    } else if (level === 2) {
      const { id: group_id, project_id } = data.otherData
      tableParams.value = {
        group_id,
      }
    }
    getTableData()
  },
})

// 搜索配置
let searchConfig = computed(() => ({
  buttonList: [
    {
      label: '创建计划',
      config: {
        type: 'primary',
        disabled: false,
      },
      emit: 'create',
    },
    {
      label: '批量执行',
      config: {
        type: 'primary',
        disabled: selection.value.length === 0,
      },
      emit: 'exec',
    },
  ],
  query(v) {
    tableParams.value.plan_title = v
    getTableData()
  },
}))

let tableParams = ref({})
let tableData = ref([])
let pageConfig = reactive({
  curPage: 1,
  pageSize: 10,
  total: 0,
})
let getTableData = async function () {
  let { curPage, pageSize } = unref(pageConfig)
  let { case_group_id } = unref(tableParams)
  let res = await axios({
    method: 'POST',
    url: '/iftest/case/plan/list',
    data: {
      curPage,
      pageSize,
      ...unref(tableParams),
    },
  })

  tableData.value = res.data.datasList
  pageConfig.total = res.data.total
}

const currentChange = function (v) {
  pageConfig.curPage = v
  getTableData()
}

const sizeChange = function (v) {
  pageConfig.pageSize = v
  getTableData()
}

let selection = ref([])
let handleSelectionChange = function (select) {
  selection.value = select
}

let handleCreate = () => {
  router.push('/testplans/create')
}

let handleExec = async function (rowList = []) {
  let env = ref()

  ElMessageBox({
    title: '提示',
    message: h(DialogExec, {
      onInput: v => {
        env.value = v
      },
    }),
  }).then(async () => {
    let res = await axios({
      method: 'POST',
      url: '/iftest/case/execute/run',
      data: { plan_list: rowList.map(row => row.id), scene_list: [], test_case: [], branch: env.value },
    })
    ElMessage({
      type: res.code === 200 ? 'success' : 'error',
      message: res.message,
    })

    if (res.code === 200) {
      // 执行成功，跳转执行结果列表，携带批次id
      router.push({
        path: '/execresults/list',
        query: {
          batch_id: res.batch_id,
          plan_id: rowList.map(row => row.id),
        },
      })
    }
  })
}

let handleEdit = ({ row }) => {
  window.localStorage.setItem('test-plan-edit', JSON.stringify(row))
  router.push('/testplans/edit')
}

let handleDelete = async ({ row }) => {
  await ElMessageBox.confirm(`确认删除 ${row.plan_title} ?`, '提示')
  let res = await axios({
    method: 'POST',
    url: '/iftest/case/plan/del',
    data: {
      id: row.id,
    },
  })
  ElMessage({
    type: res.code === 200 ? 'success' : 'error',
    message: res.message,
  })

  if (res.code === 200) {
    if (tableData.value.length == 1 && pageConfig.curPage > 1) {
      pageConfig.curPage--
    }
    getTableData()
  }
}

/**
 * 跳转结果
 * @param {*} param0
 */
const routeToResult = function ({ row }) {
  router.push({
    path: '/execresults/list',
    query: {
      plan_id: row.id,
    },
  })
}
</script>
<style lang="scss" scoped>
.test-plans {
  height: inherit;
}
</style>
