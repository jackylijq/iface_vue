<template>
  <div class="atomic-cases-list">
    <treeTable
      :treeConfig="{ ...treeConfig, defaultExpandedKeys, currentNodeKey }"
      :searchConfig="searchConfig"
      @create="btnCreate"
      :pageConfig="computedPageConfig"
      @current-change="currentChange"
      :level="levelData"
      @size-change="sizeChange"
    >
      <template #prepend>
        <el-select v-model="searchType" style="width: 100px" @change="typeChanged">
          <el-option label="用例名称" value="case_title" />
          <el-option label="接口路径" value="request_url" />
        </el-select>
      </template>

      <template #table>
        <el-table
          v-if="searchType === 'case_title'"
          :data="tableData"
          stripe
          style="width: 100%"
          @row-click="handleRowClick"
        >
          <el-table-column :show-overflow-tooltip="true" prop="id" label="用例编号" width="100px" />
          <el-table-column :show-overflow-tooltip="true" prop="iface_name" label="接口名称" />

          <el-table-column :show-overflow-tooltip="true" prop="case_title" label="用例名称" />
          <!-- <el-table-column :show-overflow-tooltip="true" prop="case_desc" label="用例描述" /> -->
          <el-table-column :show-overflow-tooltip="true" prop="case_type" label="用例类型" width="150px" />
          <el-table-column :show-overflow-tooltip="true" prop="case_status" label="用例状态" width="150px" />
          <!-- <el-table-column :show-overflow-tooltip="true" prop="exeResult" label="执行结果" /> -->
          <el-table-column :show-overflow-tooltip="true" prop="update_time" label="更新时间" />
          <el-table-column prop="address" label="操作" width="300">
            <template #default="scope">
              <el-button type="primary" text size="small" @click.stop="testClick(scope)">测试</el-button>
              <el-button size="small" @click.stop="copyClick(scope)">复制</el-button>
              <el-button size="small" @click.stop="editClick(scope)">编辑</el-button>
              <el-button type="danger" size="small" @click.stop="delClick(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-else :data="tableData" stripe style="width: 100%" @row-click="handleRowClick">
          <el-table-column :show-overflow-tooltip="true" prop="id" label="接口ID" />
          <el-table-column :show-overflow-tooltip="true" prop="iface_name" label="接口名称">
            <template #default="{ row }">
              <a style="color: #3963bc">{{ row.iface_name }}</a>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="project_name" label="项目名称" />
          <el-table-column :show-overflow-tooltip="true" prop="group_name" label="分组名称" />
          <el-table-column :show-overflow-tooltip="true" prop="request_url" label="接口路径" />
        </el-table>
      </template>
      <template #view>
        <div class="view">
          <div class="title">基本信息</div>
          <el-form ref="baseFormRef" :model="formData" label-width="120px">
            <el-form-item label="接口名称">
              <div class="input">{{ formData.name }}</div>
            </el-form-item>
            <el-form-item label="接口地址">
              <span class="postBtn">{{ formData.method }}</span>
              <div class="input">{{ formData.address }}</div>
            </el-form-item>
          </el-form>

          <div class="headerTitle">请求参数</div>
          <div class="apply">
            <div class="applyTitle">Headers:</div>
            <el-table :data="applyTableData" stripe style="width: 100%" @row-click="handleRowClick">
              <el-table-column :show-overflow-tooltip="true" prop="name" label="参数名称" />
              <el-table-column :show-overflow-tooltip="true" prop="value" label="参数值" />
              <el-table-column :show-overflow-tooltip="true" prop="required" label="是否必须" :formatter="change" />
              <el-table-column :show-overflow-tooltip="true" prop="t3" label="示例" />
              <el-table-column :show-overflow-tooltip="true" prop="desc" label="备注" />
            </el-table>
            <div class="applyTitle">Query:</div>
            <el-table
              :data="queryTableData"
              stripe
              style="width: 100%"
              @row-click="handleRowClick"
              :tree-props="{ children: 'children' }"
              row-key="name"
            >
              <el-table-column :show-overflow-tooltip="true" prop="name" label="参数名称" />
              <el-table-column :show-overflow-tooltip="true" prop="required" label="是否必须" :formatter="change" />
              <el-table-column :show-overflow-tooltip="true" prop="t3" label="示例" />
              <el-table-column :show-overflow-tooltip="true" prop="description" label="备注" />
            </el-table>
          </div>
          <div class="headerTitle">返回数据</div>
          <el-table
            class="backTable"
            :data="backTableData"
            stripe
            style="width: 100%"
            @row-click="handleRowClick"
            row-key="name"
            :tree-props="{ children: 'children' }"
          >
            <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" />
            <el-table-column :show-overflow-tooltip="true" prop="type" label="类型" />
            <el-table-column :show-overflow-tooltip="true" prop="required" label="是否必须" :formatter="change" />
            <el-table-column :show-overflow-tooltip="true" prop="" label="默认值" />
            <el-table-column :show-overflow-tooltip="true" prop="description" label="备注" />
            <el-table-column :show-overflow-tooltip="true" prop="format" label="其他信息" />
          </el-table>
        </div>
      </template>
    </treeTable>
  </div>
</template>
<script>
import treeTable from '@/component/base/treeTable/treeTableTab.vue'
import axios from '@/lin/plugin/axios'
import { ref, unref, computed, nextTick, watch, reactive, onBeforeMount } from 'vue'
import router from '../../router'
import { ElMessage, ElMessageBox } from 'element-plus'
import Utils from 'lin/util/util'

export default {
  components: { treeTable },
  setup() {
    const canCreate = ref(true)
    const currentNodeKey = ref('')
    const defaultExpandedKeys = ref([])
    const projectData = ref([])
    const change = function (row) {
      if (row.required == '0') {
        return '否'
      } else if (row.required == '1') {
        return '是'
      }
    }
    const levelData = reactive({
      level: '',
    })
    let formData = reactive({
      name: '',
      address: '',
      method: '',
    })
    const handleClick = (tab, event) => {}
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
          projectData.value = nodeData
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
          if (currentNodeKey.value) {
            let currentNodeKeyCopy = unref(currentNodeKey)
            currentNodeKey.value = ''
            setTimeout(() => {
              currentNodeKey.value = currentNodeKeyCopy
            }, 0)
          }
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
          if (currentNodeKey.value) {
            let currentNodeKeyCopy = unref(currentNodeKey)
            currentNodeKey.value = ''
            setTimeout(() => {
              currentNodeKey.value = currentNodeKeyCopy
            }, 0)
          }
        } else {
          resolve([])
        }
      },
      nodeClickFn(data, node) {
        pageConfig.value.curPage = 1
        pageConfig.value.pageSize = 10
        const { level } = node
        canCreate.value = level != 3
        searchString.value = ''
        tableParams.value.case_title = undefined
        tableParams.value.request_url = undefined

        if (level === 1) {
          tableParams.value.project_id = data.otherData.id
          tableParams.value.group_id = undefined
          tableParams.value.iface_id = undefined
        } else if (level === 2) {
          const { id: group_id, project_id } = data.otherData
          tableParams.value.project_id = project_id
          tableParams.value.group_id = group_id
          tableParams.value.iface_id = undefined
        } else if (level === 3) {
          const { id: iface_id, group_id, project_id } = data.otherData
          tableParams.value.iface_id = iface_id
          tableParams.value.group_id = group_id
          tableParams.value.project_id = project_id
          getIfaceDetail(iface_id)
        }
        levelData.level = level
        console.log(levelData.level, 'levelData.level')
        getTableData()
      },
    })

    let searchType = ref('case_title')
    let typeChanged = val => {
      tableParams.value = {}

      currentNodeKey.value = ''
      setTimeout(() => {
        currentNodeKey.value = '-1'
      }, 0)

      nextTick(() => {
        getTableData()
      })
    }

    let searchString = ref('')
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
      defaultSearchValue: searchString.value,
      query(v) {
        searchString.value = v
        tableParams.value = {}
        tableParams.value[unref(searchType)] = v || undefined

        currentNodeKey.value = ''
        setTimeout(() => {
          currentNodeKey.value = '-1'
        }, 0)

        // TODO: 根据搜索类型调整表格

        getTableData()
      },
    }))

    onBeforeMount(() => {
      // if (unref(searchType) === 'case_title') {
      //   let recodeSearchValue = null // window.localStorage.getItem('atomic-cases-list-search')
      //   tableParams.value[unref(searchType)] = recodeSearchValue === null ? '' : recodeSearchValue
      // }
    })

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

    let handleRowClick = function ({ project_id, group_id, iface_id, id }) {
      defaultExpandedKeys.value = [
        `${project_id}`,
        `${project_id}-${group_id}`,
        `${project_id}-${group_id}-${iface_id || id}`,
      ]
      currentNodeKey.value = `${project_id}-${group_id}-${iface_id || id}`

      tableParams.value.project_id = project_id
      tableParams.value.group_id = group_id
      tableParams.value.iface_id = iface_id || id
      searchType.value = 'case_title'
      getTableData()
    }

    // 点击测试按钮
    const testClick = async function (scope) {
      let params = { plan_list: [], scene_list: [], test_case: [], branch: 'test' }
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
    let queryTableData = ref([])
    let applyTableData = ref([])
    let backTableData = ref([])
    let tableParams = ref({
      request_url: '',
      case_title: '',
      project_id: '',
      iface_id: '',
    })
    let getIfaceDetail = async function (iface_id) {
      let data = { id: iface_id }
      formData.name = ''
      formData.address = ''
      formData.method = ''
      applyTableData.value = []
      queryTableData.value = []
      backTableData.value = []
      const res = await axios({
        method: 'post',
        url: '/iftest/iface/iface_detail',
        data,
      })
      console.log(res, 'res')
      const { req_headers, req_body, res_body, iface_name, request_url, request_method } = res.data
      formData.name = iface_name
      formData.address = request_url
      formData.method = request_method
      let req_headersJson = req_headers
        .replace(RegExp('[(]', 'g'), '')
        .replace(RegExp('[)]', 'g'), '')
        .replace(RegExp('ObjectId', 'g'), '')
      applyTableData.value = JSON.parse('[' + req_headersJson + ']')
      if (typeof req_body == 'string' && req_body !== '') {
        if (req_body.indexOf('ObjectId') !== -1) {
          let req_bodyJson = req_body
            .replace(RegExp('[(]', 'g'), '')
            .replace(RegExp('[)]', 'g'), '')
            .replace(RegExp('ObjectId', 'g'), '')
          queryTableData.value = JSON.parse('[' + req_bodyJson + ']')
        } else {
          let queryJson = JSON.parse(req_body.replace(/[\r|\n|\t]/g, ''))
          if (queryJson.items) {
            transObj(queryJson.items)
          } else if (queryJson.properties) {
            queryTableData.value = transObj(queryJson)
          }
        }
      } else if (typeof req_body == 'object') {
        if (req_body.items) {
          queryTableData.value = transObj(req_body.items)
        } else if (req_body.properties && !req_body.$$ref) {
          queryTableData.value = transObj(req_body)
        } else if (req_body.properties && req_body.$$ref) {
          queryTableData.value = objToTree(req_body.properties)
        }
      }
      if (res_body.items) {
        backTableData.value = transObj(res_body.items)
      } else if (res_body.properties && !res_body.$$ref) {
        backTableData.value = transObj(res_body)
      } else if (res_body.properties && res_body.$$ref) {
        backTableData.value = objToTree(res_body.properties)
      }
    }
    let transObj = function (obj) {
      let arr = []
      for (let key in obj.properties) {
        let itemObj = {
          name: key,
          type: obj.properties[key].type,
          description: obj.properties[key].description || '',
        }
        if (obj.required && obj.required.includes(key) == true) {
          itemObj.required = 1
        } else {
          itemObj.required = 0
        }
        if (itemObj.type == 'array') {
          itemObj.children = transObj(obj.properties[key].items)
        } else if (itemObj.type == 'object') {
          itemObj.children = transObj(obj.properties[key])
        }
        arr.push(itemObj)
      }
      return arr
    }
    let objToTree = function (obj) {
      let arr = []
      for (let key in obj) {
        //判断每个值是不是一个对象
        if (typeof obj[key] === 'object') {
          if (obj[key].properties) {
            arr.push({
              name: key,
              type: obj[key].type,
              description: obj[key].description,
              children: objToTree(obj[key].properties),
              required: 0,
            })
          } else if (obj[key].items) {
            arr.push({
              name: key,
              type: obj[key].type,
              description: obj[key].description,
              children: objToTree(obj[key].items.properties),
              required: 0,
              format: 'item 类型:' + obj[key].items['type'],
            })
          } else {
            let newobj = {
              name: key,
              type: obj[key].type,
              description: obj[key].description,
              required: 0,
            }
            obj[key].format ? (newobj.format = obj[key].format) : ''
            arr.push(newobj)
          }
        } else {
          arr.push({
            key: obj[key],
          })
        }
      }
      return arr
    }
    let getTableData = Utils.debounce(async function () {
      // tableParams.value[unref(searchType) === 'case_title' ? 'request_url':'case_title' ] = undefined
      let data = {
        ...unref(tableParams),
        ...unref(pageConfig),
      }
      if (!data.project_id || data.project_id === '-1') delete data.project_id
      if (!data.iface_id) delete data.iface_id

      let url = unref(searchType) === 'case_title' ? '/iftest/case/standStom/list' : '/iftest/iface/iface_list'
      const res = await axios({
        method: 'post',
        url,
        data,
      })

      let { datasList, curPage, pageSize, total } = res.data
      if (searchType.value === 'case_title') {
      } else {
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
      }
      tableData.value = datasList
      pageConfig.value = {
        curPage,
        pageSize,
      }
      totalConfig.value = total
    }, 300)

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
      typeChanged,
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
      levelData,
      formData,
      applyTableData,
      queryTableData,
      backTableData,
      getIfaceDetail,
      change,
      objToTree,
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
.title {
  font-size: 16px;
  color: #000000d8;
  margin: 0 0 20px 20px;
  font-weight: 700;
  position: relative;
  &::before {
    position: absolute;
    content: '';
    left: -12px;
    top: 0;
    width: 4px;
    height: 20px;
    background: #000000d8;
  }
}
.headerTitle {
  font-size: 16px;
  font-weight: 700;
  color: #000000d8;
  margin: 20px 0 20px 20px;
  position: relative;
  &::before {
    position: absolute;
    content: '';
    left: -12px;
    top: 0;
    width: 4px;
    height: 20px;
    background: #000000d8;
  }
}
.applyTitle {
  font-size: 14px;
  padding: 10px 0 10px 30px;
  font-weight: 700;
}
.postBtn {
  display: inline-block;
  background-color: #339e37;
  color: #fff;
  border-radius: 2px;
  width: 72px;
  height: 32px;
  text-align: center;
}
.input {
  width: 320px;
  height: 32px;
  padding-left: 10px;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  border-radius: 3px;
  display: inline-block;
}
.backTable {
  margin-bottom: 40px;
}

::v-deep .el-table__expand-icon {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
::v-deep .el-table__expand-icon > .el-icon {
  display: none !important;
}
::v-deep .el-table__expand-icon:before {
  background: url('../../assets/image/table/open.png') no-repeat;
  content: '';
  display: block;
  width: 15px;
  height: 20px;
  font-size: 18px;
  background-size: 14px;
  margin-top: 4px;
}

::v-deep .el-table__expand-icon--expanded:before {
  background: url('../../assets/image/table/close.png') no-repeat;
  content: '';
  display: block;
  width: 15px;
  height: 20px;
  font-size: 18px;
  background-size: 14px;
  margin-top: 4px;
}
</style>
<style>
::v-deep.el-table__expand-icon {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
::v-deep.el-table__expand-icon .el-icon-arrow-right:before {
  background: url('../../assets/image/table/open.png') no-repeat 0 1px;
  content: '';
  display: block;
  width: 15px;
  height: 20px;
  font-size: 18px;
  background-size: 14px;
}

::v-deep.el-table__expand-icon--expanded .el-icon-arrow-right:before {
  background: url('../../assets/image/table/close.png') no-repeat 0 1px;
  content: '';
  display: block;
  width: 15px;
  height: 20px;
  font-size: 18px;
  background-size: 14px;
}
</style>
