<template>
  <div class="atomic-cases-list">
    <treeTable
      :treeConfig="{ ...treeConfig, defaultExpandedKeys, currentNodeKey }"
      :searchConfig="searchConfig"
      @create="btnCreate"
      :pageConfig="computedPageConfig"
      @current-change="currentChange"
      @size-change="sizeChange"
    >
      <template #prepend>
        <el-select v-model="searchType" style="width: 100px">
          <el-option label="用例名称" value="case_title" />
          <el-option label="接口路径" value="request_url" />
        </el-select>
      </template>

      <template #table>
        <el-table :data="tableData" stripe style="width: 100%" @row-click="handleRowClick">
          <el-table-column :show-overflow-tooltip="true" prop="id" label="用例编号" width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="iface_name" label="接口名称" />
          <!-- <el-table-column :show-overflow-tooltip="true" prop="request_url" label="接口路径" /> -->
          <el-table-column :show-overflow-tooltip="true" prop="case_title" label="用例名称" />
          <!-- <el-table-column :show-overflow-tooltip="true" prop="case_desc" label="用例描述" /> -->
          <el-table-column :show-overflow-tooltip="true" prop="case_type" label="用例类型" width="150px" />
          <el-table-column :show-overflow-tooltip="true" prop="case_status" label="用例状态" width="150px" />
          <!-- <el-table-column :show-overflow-tooltip="true" prop="exeResult" label="执行结果" /> -->
          <el-table-column :show-overflow-tooltip="true" prop="update_time" label="更新时间" />
          <el-table-column prop="address" label="操作" width="300">
            <template #default="scope">
              <el-button type="primary" text size="small" @click="testClick(scope)">测试</el-button>
              <el-button size="small" @click="copyClick(scope)">复制</el-button>
              <el-button size="small" @click="editClick(scope)">编辑</el-button>
              <el-button type="danger" size="small" @click="delClick(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </treeTable>
  </div>
</template>
<script>
import treeTable from '@/component/base/treeTable/treeTable.vue'
import axios from '@/lin/plugin/axios'
import { ref, unref, computed, nextTick } from 'vue'
import router from '../../router'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  components: { treeTable },
  setup() {
    const canCreate = ref(true)
    const currentNodeKey = ref('')
    const defaultExpandedKeys = ref([])
    const treeConfig = ref({
      data: [],
      lazy: true,
      nodeKey: 'id',
      props: { isLeaf: 'leaf' },
      async load(node, resolve) {
        const { level } = node
        if (level === 0) {
          const res = await axios({
            method: 'post',
            url: '/iftest/iface/project/list',
          })
          const nodeData = [
            { id: '-1', label: '全部', leaf: true, otherData: { id: '-1' } },
            ...res.data.datasList.map(v => ({
              id: `${v.id}`,
              label: v.pro_name,
              otherData: v,
            })),
          ]
          resolve(nodeData)
          defaultExpandedKeys.value = [nodeData[0]?.id]
          currentNodeKey.value = nodeData[0]?.id
          getTableData()
        } else if (level === 1) {
          const { id: project_id } = node.data.otherData
          if (project_id === '-1') {
            resolve([])
            return
          }
          const res = await axios({
            method: 'post',
            url: '/iftest/iface/group/list',
            data: {
              project_id,
            },
          })
          resolve(
            res.data.datasList.map(v => ({
              id: `${project_id}-${v.id}`,
              label: v.group_name,
              otherData: v,
            })),
          )
        } else if (level === 2) {
          const { id: group_id, project_id } = node.data.otherData
          const res = await axios({
            method: 'post',
            url: '/iftest/iface/iface_list',
            data: {
              group_id,
              project_id,
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
        } else {
          resolve([])
        }
      },
      nodeClickFn(data, node) {
        pageConfig.value.curPage = 1
        pageConfig.value.pageSize = 10
        const { level } = node
        canCreate.value = level != 3
        if (level === 1) {
          tableParams.value = {
            project_id: data.otherData.id,
          }
        } else if (level === 2) {
          const { id: group_id, project_id } = data.otherData
          tableParams.value = {
            group_id,
            project_id,
          }
        } else if (level === 3) {
          const { id: iface_id, group_id, project_id } = data.otherData
          tableParams.value = {
            iface_id,
            group_id,
            project_id,
          }
        }
        getTableData()
      },
    })

    let searchType = ref('case_title')
    const searchConfig = computed(() => ({
      buttonList: [
        {
          label: '创建',
          config: {
            type: 'primary',
            disabled: unref(canCreate),
          },
          emit: 'create',
        },
        {
          label: '删除',
          config: {
            type: 'default',
            disabled: true,
          },
          emit: 'delete',
        },
      ],
      query(v) {
        tableParams.value[unref(searchType)] = v || undefined
        getTableData()
      },
    }))

    // 点击创建
    const btnCreate = function () {
      router.push({ path: '/atomiccase/add', query: unref(tableParams) })
    }

    // 点击编辑
    const editClick = function (scope) {
      let params = { ...scope.row }
      params.req_body = JSON.stringify(params.req_body)
      params.res_body = JSON.stringify(params.res_body)
      // params.case_status = JSON.stringify(params.case_status);
      params.case_variable = JSON.stringify(params.case_variable)
      params.header = JSON.stringify(params.header)
      params.request_param = JSON.stringify(params.request_param)
      params.response = JSON.stringify(params.response)
      params.result_check = JSON.stringify(params.result_check)
      params.result_variable = JSON.stringify(params.result_variable)
      router.push({ path: '/atomiccase/edit', query: params })
    }

    let handleRowClick = function (row) {
      defaultExpandedKeys.value = [row.project_id]
      nextTick(() => {
        // currentNodeKey.value = row.project_id
        defaultExpandedKeys.value = [row.group_id]
      })
    }

    // 点击测试按钮
    const testClick = async function (scope) {
      let params = { test_case: [] }
      params.test_case = [scope.row.id]
      const res = await axios({
        method: 'post',
        url: '/iftest/case/execute/test',
        data: {
          ...unref(params),
        },
      })
      ElMessage[res.code == 200 ? 'success' : 'error'](res.message)
      if (res.code == 200) {
        console.log('测试成功，刷新页面')
        getTableData()
      }
    }

    // 点击复制按钮
    const copyClick = async function (scope) {
      let params = { id: 0 }
      params.id = scope.row.id
      const res = await axios({
        method: 'post',
        url: '/iftest/case/build/copy',
        data: {
          ...unref(params),
        },
      })
      ElMessage[res.code == 200 ? 'success' : 'error'](res.message)
      if (res.code == 200) {
        console.log('复制成功，刷新页面')
        getTableData()
      }
    }

    // 点击删除按钮
    const delClick = async function (scope) {
      // 定义要删除的用例id
      let params = { test_case: [] }
      params.test_case = [scope.row.id]
      // 进行确认提示
      this.loading = true
      this.$confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await axios({
          method: 'post',
          url: '/iftest/case/execute/test',
          data: {
            ...unref(params),
          },
        })
        ElMessage[res.code == 200 ? 'success' : 'error'](res.message)
        if (res.code == 200) {
          console.log('测试成功，刷新页面')
          getTableData()
        }
      })
    }

    // 获取表格数据
    let pageConfig = ref({
      curPage: 1,
      pageSize: 10,
    })
    const totalConfig = ref(0)
    const tableData = ref([])
    let tableParams = ref({
      project_id: '',
      iface_id: '',
    })
    let getTableData = async function () {
      let data = {
        ...unref(tableParams),
        ...unref(pageConfig),
      }
      if (!data.project_id || data.project_id === '-1') delete data.project_id
      if (!data.iface_id) delete data.iface_id

      const res = await axios({
        method: 'post',
        url: '/iftest/case/standStom/list',
        data,
      })

      const { datasList, curPage, pageSize, total } = res.data
      tableData.value = datasList
      pageConfig.value = {
        curPage,
        pageSize,
      }
      totalConfig.value = total
    }

    const computedPageConfig = computed(() => ({
      currentPage: unref(pageConfig).curPage,
      pageSize: unref(pageConfig).pageSize,
      total: unref(totalConfig),
    }))

    const currentChange = function (v) {
      pageConfig.value.curPage = v
      getTableData()
    }

    const sizeChange = function (v) {
      pageConfig.value.pageSize = v
      getTableData()
    }

    return {
      currentNodeKey,
      defaultExpandedKeys,
      treeConfig,

      canCreate,
      searchConfig,
      searchType,
      btnCreate,
      editClick,
      handleRowClick,

      testClick,
      delClick,
      copyClick,

      tableData,
      computedPageConfig,
      currentChange,
      sizeChange,
    }
  },
}
</script>
<style lang="scss" scoped>
.atomic-cases-list {
  height: 100%;

  :deep .cell.el-tooltip {
    display: inline-block;
  }
}

.white-space {
  display: inline-block;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
