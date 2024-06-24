<template>
  <div class="edit">
    <div class="editHeader">
      <span> {{ form.caseTitle }} </span>
      <div class="tableHeader">
        <div class="tableSetting">
          <el-tooltip effect="dark" content="保存" placement="top">
            <!-- <el-icon @click="handleSave">
              <FolderOpened />
            </el-icon> -->
            <img src="../../assets/image/integrationCases/fileSave.png" @click="handleSave" alt="" />
          </el-tooltip>
          <el-tooltip effect="dark" content="测试" placement="top">
            <!-- <el-icon @click="handleSave">
              <FolderOpened />
            </el-icon> -->
            <img src="../../assets/image/integrationCases/test.svg" @click="handleTest" style="width: 21px" alt="" />
          </el-tooltip>

          <el-tooltip effect="dark" content="批量删除" placement="top">
            <svg
              style="transform: translateY(2px)"
              @click="batchDelete"
              t="1718845320104"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2315"
              width="18"
              height="18"
            >
              <path
                d="M341.312 85.312l64-85.312h213.376l64 85.312H960v85.376H64V85.312h277.312zM170.688 256h682.624v768H170.688V256z m298.624 170.688H384v426.624h85.312V426.688z m170.688 0H554.688v426.624H640V426.688z"
                fill="#797979"
                p-id="2316"
              ></path>
            </svg>
          </el-tooltip>
        </div>
        <div class="pageChange">
          <el-switch v-model="pageType" active-text="列表模式" inactive-text="画布模式" @change="changeType" />
        </div>
      </div>
    </div>
    <div class="editMain">
      <div class="basicInfor">
        <div class="basicTitle">基本信息</div>
        <el-form label-width="86px" ref="refForm" :rules="rules" :model="form" class="custom-table" :disabled="canEdit">
          <el-form-item label="用例标题" prop="caseTitle">
            <el-input v-model="form.caseTitle" />
          </el-form-item>
          <el-form-item label="用例描述">
            <el-input type="textarea" v-model="form.caseDesc" />
          </el-form-item>
          <el-form-item label="用例状态">
            <el-radio-group v-model="form.caseType">
              <el-radio label="1">正常</el-radio>
              <el-radio label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用例分组" prop="caseGroupId">
            <el-tree-select
              ref="refEltree"
              check-strictly
              lazy
              nodeKey="id"
              :load="load"
              :props="defaultProps"
              v-model="form.caseGroupId"
              @change="handleChange"
            />
          </el-form-item>
        </el-form>
        <div class="basicTitle">环境配置</div>
        <el-form label-width="86px" class="custom-table" :disabled="canEdit">
          <el-form-item label="测试环境" prop="caseTitle">
            <el-select v-model="testEnv">
              <el-option v-for="item in envList" :key="item.id" :value="item.branch" :label="item.env_name" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="caseTable">
        <div class="tablePlace marBotSytle">
          <el-table
            ref="tableRef"
            stripe
            :data="tableData"
            :border="parentBorder"
            :row-key="getRowKey"
            @row-click="handleRowClick"
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
            :expand-row-keys="expandedRows"
            :row-style="getRowClassName"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column type="expand" width="1">
              <template #default="{ row, $index }">
                <row-detail
                  :key="modTime"
                  :msg="row"
                  @updateDetail="changeRow"
                  @update-json-error="updateJsonError"
                  :canEdit="canEdit"
                  v-show="canSee"
                ></row-detail>
                <atomic-row-detail v-if="!canSee" :rowId="row.id"></atomic-row-detail>
              </template>
            </el-table-column>
            <el-table-column label="用例编码" prop="id" width="90">
              <template #default="{ row, $index }">
                <span class="integration_id" :data-old-id="`${row.id}_${$index}`">{{ row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="用例标题" prop="case_title" show-overflow-tooltip />
            <el-table-column label="用例描述" prop="case_desc" show-overflow-tooltip />
            <el-table-column label="等待时间" prop="wait_time" show-overflow-tooltip>
              <template #default="{ row }">
                <!-- <div class="waitText" v-show="changeWait" @click.stop="changeWait = false">{{ row.wait_time }}</div> -->
                <div class="waitInput" @click.stop="">
                  <el-input v-model="row.wait_time" size="small" :disabled="canEdit" />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="用量变量" prop="case_variable" show-overflow-tooltip>
              <template #default="{ row }">{{ row.case_variable }}</template>
            </el-table-column>
            <el-table-column label="结果变量" prop="result_variable" show-overflow-tooltip>
              <template #default="{ row }">{{ row.result_variable }}</template>
            </el-table-column>
            <el-table-column fix="right" label="操作" width="120px">
              <template #default="scope">
                <span class="iconPlace">
                  <el-icon @click.stop="changeCanEdit(scope)">
                    <Edit />
                  </el-icon>
                  <el-icon @click.stop="synchronous(scope)">
                    <Switch />
                  </el-icon>
                  <!-- <el-icon v-show="scope.$index !== 0" v-if="!canEdit" @click.stop="moveUp(scope)">
                    <Top />
                  </el-icon>
                  <el-icon v-show="scope.$index !== tableData.length - 1" v-if="!canEdit" @click.stop="moveDown(scope)">
                    <Bottom />
                  </el-icon> -->
                  <el-icon @click.stop="handleRemove(scope)" v-if="!canEdit">
                    <Delete />
                  </el-icon>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <div class="paginPlace toRight marBotSytle">
          <el-pagination current-page="curPage" :page-size="5" :page-sizes="[100, 200, 300, 400]" :small="small"
            :backgrouactiveIndexnd="background" layout="total, prev, pager, next, jumper" :total="total" />
        </div> -->
      </div>
    </div>
    <div class="addDialog">
      <el-button type="primary" :icon="Plus" circle @click="handleAdd" v-if="!canEdit" />
    </div>
    <add-cases
      :value="casesListShow"
      @input="
        val => {
          casesListShow = val
          val === false && (activeIndex = -1)
        }
      "
      @save="addTableRow"
    ></add-cases>

    <SycronDia
      :value="sycronDiaShow"
      :sycronDiaInfo="sycronDiaInfo"
      @input="
        val => {
          sycronDiaShow = false
        }
      "
      @submit="handleSubmit"
    />
  </div>
</template>
<script setup>
import { ref, onMounted, unref, reactive, computed, watchEffect, nextTick, inject } from 'vue'
import { useStore } from 'vuex'
import { FolderOpened, Plus, FolderRemove, Delete, Top, Bottom, Edit, Switch } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from '@/lin/plugin/axios'
import emitter from 'lin/util/emitter'
import RowDetail from './RowDetail.vue'
import AddCases from './addCases.vue'
import AtomicRowDetail from '../atomicCases/atomic-row-detail.vue'
import router from '../../router'
import SycronDia from './sycronDia.vue'
import store from '@/store'
import { createSortable } from '../testPlans/sortJs'

let tableRef = ref()
onMounted(() => {
  createSortable(tableRef.value.$el.querySelector('.el-table__body-wrapper .el-table__body tbody'))
})
let multipleSelection = ref([])
function tableRowClassName({ row, rowIndex }) {
  return multipleSelection.value.some(v => v.id === row.id) ? 'selected' : ''
}
function handleSelectionChange(val) {
  multipleSelection.value = val
}
function batchDelete() {
  tableData.value = unref(tableData).filter(v => !unref(multipleSelection).some(e => e.id === v.id))
  multipleSelection.value = []
}

// 获取用户id
const editId = useStore().getters.user.id

// 缓存的key
let locationKey = 'caseData'

// route中的信息
const id = computed(() => router.currentRoute.value.query.id)

// 页面显示模式
const pageType = ref(true)
const changeType = () => {
  if (router.currentRoute.value.query.id) {
    router.push({ path: '/integrationcases/edit', query: { ...router.currentRoute.value.query } })
  } else if (router.currentRoute.value.query.group_id) {
    router.push({ path: '/integrationcases/add', query: { ...router.currentRoute.value.query } })
  }
}

// 表格设置
const parentBorder = ref(false)
const childBorder = ref(false)
let tableData = ref([])
const cellStyle = {
  fontSize: '18px', // 设置单元格字体大小
}
const total = computed(() => unref(tableData).length)
const curPage = ref(1)

// 控制展现组件
const canSee = ref(true)
// 表格点击展开
const expandedRows = ref([]) // 存储已展开的行的 row-key
const getRowKey = row => row.tableId // 指定唯一的 row-key
// 点击查看原子用例详情
const handleRowClick = row => {
  if (expandedRows.value.includes(row.tableId) && canSee.value === false) {
    // 如果该行已经展开，则收起
    expandedRows.value = expandedRows.value.filter(tableId => tableId !== row.tableId)
  } else {
    // 如果该行未展开，则展开
    expandedRows.value = [...expandedRows.value, row.tableId]
  }
  canSee.value = false
  currentRowKey.value = row.tableId
}

// 选中的节点
const activeIndex = ref(-1)

// 修改table中的RowDetail信息
const changeRow = ({ key, data, tableId }) => {
  const index = unref(tableData).findIndex(item => item.tableId === tableId)
  tableData.value[index][key] = data
}

// 添加原子用例
const casesListShow = ref(false)
const handleAdd = function () {
  activeIndex.value = unref(tableData).length - 1
  casesListShow.value = true
}

const addTableRow = function (caseInfo = {}) {
  caseInfo.row.tableId = unref(tableData).length
  const index = unref(activeIndex)
  tableData.value.splice(index + 1, 0, caseInfo.row)
}

const changeCanEdit = row => {
  if (expandedRows.value.includes(row.row.tableId) && canSee.value === true) {
    // 如果该行已经展开，则收起
    expandedRows.value = expandedRows.value.filter(tableId => tableId !== row.row.tableId)
  } else {
    // 如果该行未展开，则展开
    expandedRows.value = [...expandedRows.value, row.row.tableId]
  }
  canSee.value = true
  currentRowKey.value = row.row.tableId
}

// 删除
const handleRemove = row => {
  tableData.value.splice(row.$index, 1)
}

const currentRowKey = ref('')
const getRowClassName = ({ row }) => {
  if (row.tableId === currentRowKey.value) {
    return {
      'background-color': '#e6f7ff',
    }
  }
  // if (expandedRows.value.includes(row.tableId)) {
  //   return {
  //     'background-color': '#e6f7ff'
  //   }
  // }
  return ''
}

// 上移下移
const moveUp = row => {
  // currentRowKey.value = row.row.tableId
  // const index = row.$index
  // if (index > 0) {
  //   ;[tableData[index], tableData[index - 1]] = [tableData[index - 1], tableData[index]]
  // }
}
const moveDown = row => {
  // currentRowKey.value = row.row.tableId
  // const index = row.$index
  // if (index < tableData.length - 1) {
  //   ;[tableData[index], tableData[index + 1]] = [tableData[index + 1], tableData[index]]
  // }
}

// 基本数据表单
const form = reactive({
  caseTitle: '',
  caseDesc: '',
  caseType: '1',
  caseGroupId: '',
  // id: '',
  remark: '',
  projectId: '1',
})

const saveForm = async () => {
  await refForm.value.validate()
  const { caseTitle, caseDesc, caseType, caseGroupId, id, remark, projectId } = form

  let doms = [...tableRef.value.$el.querySelectorAll('span.integration_id')]
  let atom_case_list = doms.map(v => v.innerText)
  let oldIds = [...tableRef.value.$el.querySelectorAll('span.integration_id')].map(v => v.dataset.oldId)
  // let validateSceneCaseList = atom_case_list.every(e => unref(tableData).some(v => v.oldId == e))
  // if (!validateSceneCaseList) {
  //   ElMessage({
  //     type: 'error',
  //     message: '集成id不一致，请刷新页面',
  //   })
  //   return
  // }

  const atom_case_detail = {}
  oldIds
    .map(e => unref(tableData).find((v, i) => `${v.id}_${i}` == e))
    .forEach((e, index) => {
      atom_case_detail[`${e.id}_${index}`] = {
        request_url: e.request_url,
        case_title: e.case_title,
        case_variable: e.case_variable,
        result_variable: e.result_variable,
        case_desc: e.case_desc,
        wait_time: Number(e.wait_time),
        result_check: e.result_check,
      }
    })

  const sendData = {
    case_title: caseTitle,
    case_desc: caseDesc,
    case_type: caseType === '1' ? '正常' : '异常',
    case_group_id: caseGroupId,
    id,
    remark,
    project_id: projectId,
    edit_uid: store.getters.user.username,
    atom_case_list,
    atom_case_detail,
  }
  const res = await axios({
    method: 'POST',
    url: `/iftest/case/scene/${sendData.id ? 'modify' : 'add'}`,
    data: sendData,
  })
  return res
}

const JSONError = {}
const updateJsonError = function (key, message) {
  JSONError[key] = message
}
// 保存数据
const handleSave = async () => {
  if (Object.values(JSONError).some(v => !!v)) {
    ElMessage.error(`${Object.values(JSONError).find(v => !!v)}`)
    return
  }

  const res = await saveForm()

  ElMessage({
    type: res.code === 200 ? 'success' : 'error',
    message: res.message,
  })
  if (res.code === 200) {
    // 关闭当前tab
    window.localStorage.removeItem(locationKey)
    emitter.emit('custom-close')
    router.replace('/integrationcases/list')
  }
}

// 获取环境变量
const testEnv = ref('')
const envList = ref([])
const getEnvList = async () => {
  const params = { curPage: 1, pageSize: 100 }
  const res = await axios({
    method: 'GET',
    url: '/iftest/dispose/env/list',
    params,
  })
  if (res.code === 200) {
    const { datasList } = res.data
    envList.value = [...datasList]
    testEnv.value = datasList[0].branch
  }
}

// 测试
const handleTest = async () => {
  if (Object.values(JSONError).some(v => !!v)) {
    ElMessage.error(`${Object.values(JSONError).find(v => !!v)}`)
    return
  }

  const res0 = await saveForm()

  ElMessage({
    type: res0.code === 200 ? 'success' : 'error',
    message: res0.message,
  })
  const { id } = router.currentRoute.value.query
  const sendData = { plan_list: [], scene_list: [id], test_case: [], branch: testEnv.value }
  const res = await axios({
    method: 'POST',
    url: '/iftest/case/execute/test',
    data: sendData,
  })
  if (res.code === 200) {
    router.push({
      path: '/integrationcases/test',
      query: { scene_id: router.currentRoute.value.id, batch_id: res.batch_id },
    })
  } else {
    ElMessage({
      type: 'error',
      message: '测试失败，请重试',
    })
  }
}

const defaultProps = {
  label: 'label',
  children: 'children',
  isLeaf: 'isLeaf',
}

const refEltree = ref(null)
const load = async function (node, resolve) {
  if (node.isLeaf) return resolve([])
  const { level } = node
  if (level === 0) {
    const res = await axios({
      method: 'post',
      url: '/iftest/condition/group/list',
      data: {
        pro_line_id: 1,
        parents_id: 0,
        group_type: 'scene',
      },
    })
    const nodeData = [
      ...res.data.datasList.map(v => ({
        id: v.id,
        label: v.group_name,
        otherData: v,
      })),
    ]
    resolve(nodeData)
    if (nodeData.length > 0 && !form.id && !form.caseGroupId) {
      form.caseGroupId = nodeData[0].id
    }
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
        pro_line_id: 1,
        parents_id: id,
        group_type: 'scene',
      },
    })
    resolve(
      res.data.datasList.map(v => ({
        id: v.id,
        label: v.group_name,
        otherData: v,
        isLeaf: true,
      })),
    )
  } else {
    resolve([])
  }
}

watchEffect(() => {
  nextTick(() => {
    if (form.remark) {
      refEltree.value.$el.querySelector('.el-input__inner').value = form.remark
    }
  })
})
const handleChange = function () {
  form.remark = refEltree.value.getCurrentNode().label
}

// 表单验证
let refForm = ref('refForm')
const rules = {
  caseTitle: [{ required: true, message: '用例标题不能为空', trigger: 'change' }],
  caseGroupId: [{ required: true, message: '用例分组不能为空', trigger: 'change' }],
}
const handleBeforeClose = async function (done) {
  await refForm.value.validate()
  done()
}

onMounted(async () => {
  await getEnvList()
  getMsg()
})

// 能否编辑
const canEdit = ref(false)
const getMsg = () => {
  const { id: aid, remark: create_remark, group_id, noEdit } = router.currentRoute.value.query || {}
  if (aid) {
    locationKey = `caseData-${aid}`
    form.id = id
    canEdit.value = noEdit
  } else {
    form.remark = create_remark
    form.caseGroupId = Number(group_id)
  }
  const { id, items, case_desc, case_title, case_type, case_group_id, remark, project_id } =
    JSON.parse(window.localStorage.getItem(locationKey)) || {}
  // console.log(JSON.parse(window.localStorage.getItem(locationKey)))

  if (case_title) {
    items.forEach((item, index) => {
      item.tableId = Number(`${index}`)
    })

    tableData.value.push(...items)
    // total.value = tableData.length
    form.caseTitle = case_title
    form.caseDesc = case_desc
    form.caseType = case_type === '正常' ? '1' : '2'
    form.caseGroupId = case_group_id
    form.id = id
    form.remark = remark
    form.projectId = project_id
  }
}

const modTime = ref(new Date().getTime())
let sycronDiaShow = ref(false)
let sycronDiaInfo = reactive({})
const synchronous = async ({ row, $index }) => {
  activeIndex.value = $index
  sycronDiaInfo.inte = JSON.parse(JSON.stringify(row))
  const res = await axios({
    method: 'POST',
    url: '/iftest/case/standStom/list',
    data: {
      curPage: 1,
      pageSize: 1,
      id: row.id,
    },
  })
  if (res.code === 200) {
    const { case_variable: caseVar, result_variable: resultVar, result_check: resultCheck } = res.data.datasList[0]
    // debugger
    const { case_variable, result_variable, result_check } = row
    for (const key in caseVar) {
      if (!case_variable.hasOwnProperty(key)) {
        case_variable[key] = caseVar[key]
      }
    }
    for (const key in resultVar) {
      result_variable[key] = resultVar[key]
    }

    for (const key in resultCheck) {
      result_check[key] = resultCheck[key]
    }

    sycronDiaInfo.atomic = res.data.datasList[0]
    sycronDiaInfo.inte_combine = JSON.parse(JSON.stringify(row))
    sycronDiaShow.value = true

    // ElMessage({
    //   type: 'success',
    //   message: '同步成功',
    // })
    modTime.value = new Date().getTime()
  } else {
    // ElMessage({
    //   type: 'error',
    //   message: '同步失败',
    // })
  }
  // console.log(row)
}

let handleSubmit = function (data) {
  sycronDiaShow.value = false
  tableData.value[activeIndex.value].case_variable = JSON.parse(data[0].inte_combine)
  tableData.value[activeIndex.value].result_variable = JSON.parse(data[1].inte_combine)
  tableData.value[activeIndex.value].result_check = JSON.parse(data[2].inte_combine)
}
</script>
<style lang="css" scoped>
.edit {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.editHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 15px;
  border-bottom: #e4e7ed 1px solid;
  position: relative;
}
.editHeader span {
  font-weight: 700;
}
.editMain {
  width: 100%;
  flex: 1;
  display: flex;
}
.basicInfor {
  width: 300px;
  padding: 10px 5px;
  margin: 10px 5px;
  border: #e4e7ed 1px solid;
  box-sizing: border-box;
}
.basicTitle {
  height: 20px;
  font-weight: 700;
  line-height: 20px;
  padding: 0px 16px;
  border-radius: 4px;
  border-left: 5px solid #3963bc;
  margin: 0 0 20px 0;
}
.tableHeader {
  width: calc(100% - 340px);
  height: 47px;
  border-left: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  font-weight: 700;
  position: absolute;
  right: 0;
}
.tableHeader img {
  margin-right: 10px;
  width: 18px;
}
.tableHeader *:hover {
  cursor: pointer;
  color: #3963bc;
}
.tableSetting {
  display: flex;
  align-items: center;
}

.caseTable {
  flex: 1;
  /* padding: 0px 15px; */
  min-width: 0;
  border: #e4e7ed 1px solid;
  margin: 10px;
  border-radius: 5px;
}
.tablePlace {
  padding: 15px;
}
.iconPlace {
  width: 100%;
  font-size: 18px;
  line-height: 24px;
}
.iconPlace .el-icon {
  margin-right: 10px;
}
.iconPlace *:hover {
  color: #3963bc;
  cursor: pointer;
}
.marBotSytle {
  margin-bottom: 10px;
}
.toRight {
  display: flex;
  justify-content: flex-end;
  padding: 0px 15px;
}
.addDialog {
  position: fixed;
  bottom: 46px;
  right: 75px;
  z-index: 4;
}
::v-deep .el-button.is-circle {
  border-radius: 50%;
  padding: 8px;
  width: 28px;
  height: 28px;
}
::v-deep .el-table__cell {
  padding: 0;
}
::v-deep .el-table__expand-column .el-icon {
  display: none;
}
.el-table {
  --el-table-row-hover-bg-color: #e6f7ff !important;
}
</style>
