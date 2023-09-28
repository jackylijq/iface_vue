<template>
  <div class="atomicDetail" :class="widthType">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="基础信息" name="first">
        <atomic-row-baseinfo :formData="formData"></atomic-row-baseinfo>
      </el-tab-pane>
      <el-tab-pane label="函数变量" name="second">
        <atomic-row-fun :funcData="funcData"></atomic-row-fun>
      </el-tab-pane>
      <el-tab-pane label="请求头" name="third">
        <atomic-row-header :headerData="applyTableData"></atomic-row-header>
      </el-tab-pane>
      <el-tab-pane label="请求参数" name="fourth">
        <atomic-row-query :tableData="queryTableData"></atomic-row-query>
      </el-tab-pane>
      <el-tab-pane label="响应参数" name="fifth">
        <atomic-row-back :tableData="backTableData"></atomic-row-back>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref, reactive, toRef, onMounted, defineProps } from 'vue'
import { useRoute } from 'vue-router'
import vueRouter from '@/router'
import axios from '@/lin/plugin/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import emitter from 'lin/util/emitter'
import store from '@/store'
import AtomicRowBaseinfo from './atomic-row-baseInfo.vue'
import AtomicRowHeader from './atomic-row-header.vue'
import AtomicRowQuery from './atomic-row-query.vue'
import AtomicRowBack from './atomic-row-back.vue'
import AtomicRowFun from './atomic-row-fun.vue'

const activeName = ref('first')
const ruleFormRef = ref()
const queryTableData = ref([])
const applyTableData = ref([])
const backTableData = ref([])
const checkResponseTableData = ref([])
const checkQueryTableData = ref([])
const itemSqlDisabled = ref(true)
const checkFuncTableData = ref([])
const checkFuncSearchData = ref([])
const requestJson = ref({})
const responseJson = ref({})
const checkSql = reactive({
  response: '',
  request: '',
  itemSql: '',
  childCode: ''
})
const pageSize = ref(10)
const curPage = ref(1)
const total = ref(0)
const checkForm = reactive({
  wait_time: '0',
  checkType: '响应参数'
})
const searchForm = reactive({
  group_id: '',
  en_name: '',
  cn_name: ''
})
const checkFuncList = ref({})
const formData = ref({
  case_title: '',
  case_desc: '',
  case_type: '正常',
  wait_time: '0',
  version: '',
  case_status: '',
  header: '',
  request_param: '',
  response: '',
  result_check: `{
  "check_type":"response",
  "check_sql":"",
  "check_field":{},
  "check_position":""
}`,
  case_variable: {},
  result_variable: {},
})
const case_variable = ref({})
const result_variable = ref({})
const isFirstTrans = true
const headerTableData = ref([])
const queryBaseInfo = ref([])
const responseBaseInfo = ref([])
const levelData = reactive({
  level: ''
})
const step = ref('1')
const queryTableKey = ref(1)
const router = useRoute()
const tableParams = router.query

// 集成用例组件传过来的值
const props = defineProps({
  rowId: {
    type: String
  }
})
const getIfaceMsg = async () => {
  const sendData = { id: props.rowId, curPage: 1, pageSize: 10 }
  const res1 = await axios({
    method: 'post',
    url: '/iftest/case/standStom/list',
    data: { ...sendData },
  })
  const { case_title, case_desc, version, case_type, wait_time, iface_id, header, request_param, response, result_variable, result_check, case_variable, generic_variables } = res1.data.datasList[0]
  formData.value.case_title = case_title
  formData.value.case_desc = case_desc
  formData.value.version = version
  formData.value.case_type = case_type
  formData.value.wait_time = wait_time

  if (generic_variables) {
    funcData.value = Object.values(generic_variables).map(v => ({
      ...v,
      fun_param: JSON.stringify(v.fun_param)
    }))
  }

  for (const key in header) {
    applyTableData.value.push({
      name: key,
      value: header[key]
    })
  }
  let applyTableBaseData = []
  const data = { id: iface_id }
  const res = await axios({
    method: 'post',
    url: '/iftest/iface/iface_detail',
    data,
  })
  const req_headersJson = res.data.req_headers.replace(RegExp('[(]', 'g'), '').replace(RegExp('[)]', 'g'), '').replace(RegExp('ObjectId', 'g'), '')
  applyTableBaseData = JSON.parse(`[${req_headersJson}]`)
  headerBaseInfo.value = applyTableBaseData
  applyTableData.value.forEach(i => {
    const sameItem = headerBaseInfo.value.find(e => e.name == i.name)
    if (sameItem) {
      i.required = sameItem.required
    }
  })
  queryTableData.value = backTrans(request_param, 'query')
  backTableData.value = backTrans(response, 'response')
  for (const key in case_variable) {
    addCaseVariable(queryTableData.value, key)
  }
  for (const key in result_variable) {
    const arr = result_variable[key].replace(/\[|]/g, '').replace(RegExp('0', 'g'), '').split('.')
    addResultariable(backTableData.value, arr, 0, key, result_variable[key])
  }
  checkSql.request = result_check.request.check_sql
  checkSql.response = result_check.response.check_sql
  getAllChecked(result_check.response)
  getRequestAllChecked(result_check.request)
  checkForm.wait_time = result_check.wait_time
  // const param = {
  //   curPage: 1,
  //   pageSize: 10,
  //   en_name: result_check.third_fun.split(',')
  // }
  // const res2 = await axios({
  //   method: 'post',
  //   url: '/iftest/functions/thirdFunc-list',
  //   data: param,
  // })
  // checkFuncTableData.value = res2.data.datasList || []
  await getIfaceDetail(iface_id)
  addBaseInfo(queryTableData.value, 'query')
  addBaseInfo(backTableData.value, 'response')
}
const widthType = ref('widthMin')
const getAllMsg = () => {
  if (props.rowId !== undefined) {
    getIfaceMsg()
    widthType.value = 'widthMax'
  } else {
    getEditData()
    getIfaceDetail(tableParams.iface_id)
  }
}

const dbName = ref('')
const data = reactive({
  activeName: '0',
})
// 接口详情获取数据类型 和 是否必须 存值
function addBaseInfo(val, type) {
  if (type == 'query') {
    val.forEach(item => {
      const sameItem = queryBaseInfo.value.filter(el => el.name == item.name)
      if (sameItem.length > 0) {
        item.type = sameItem[0].type
        item.required = sameItem[0].required
        item.description = sameItem[0].description
      } else {
        item.type = item.valueType
      }
      if (item.children) {
        addBaseInfo(item.children, 'query')
      }
    })
  } else {
    val.forEach(item => {
      const sameItem = responseBaseInfo.value.filter(el => el.name == item.name)
      if (sameItem.length > 0) {
        item.type = sameItem[0].type
        item.required = sameItem[0].required
        item.description = sameItem[0].description
      } else {
        item.type = item.valueType
      }
      if (item.children) {
        addBaseInfo(item.children, 'response')
      }
    })
  }
}
// 全景转高级
const firstTrans = function (val, type) {
  const obj = {}
  val.forEach(item => {
    // if(isFirstTrans) {
    //    item.valueType = item.type
    // }
    if (!item.children || item.children.length == 0) {
      if (item.valueType == 'object') {
        obj[item.name] = {}
      } else if (item.valueType == 'null') {
        obj[item.name] = ''
      } else if (item.valueType == 'number') {
        if (item.value == undefined) {
          obj[item.name] = null
        } else {
          obj[item.name] = Number(item.value)
        }
      } else if (item.valueType == 'array' && (item.value == null || item.value == undefined || !item.value)) {
        obj[item.name] = []
      } else if (item.valueType == 'boolean') {
        obj[item.name] = item.value
      } else {
        obj[item.name] = item.value ? item.value : ''
      }
      if (typeof item.value === 'number' && item.value == 0) {
        obj[item.name] = 0
      }
    } else if (item.valueType == 'array' && item.children && (item.children.length == 1 && type == 'query' || item.children.length > 1 && type == 'query' && item.children[0].name !== '0' || item.children.length > 0 && type == 'response')) {
      obj[item.name] = [firstTrans(item.children, type)]
    } else if (item.valueType == 'array' && item.children && item.children.length > 1 && type == 'query' && item.children[0].name == '0') {
      obj[item.name] = []
      item.children.forEach((el, i) => {
        obj[item.name].push(firstTrans(el.children, type))
      })
    } else if (item.valueType == 'object' && item.children) {
      obj[item.name] = firstTrans(item.children, type)
    }
  })
  return obj
}
// 高级转全景
const backTrans = function (obj, type) {
  const arr = []
  for (const key in obj) {
    if (Array.isArray(obj[key]) && typeof obj[key][0] === 'object' && (obj[key].length <= 1 && type == 'query' || type == 'response')) {
      arr.push({
        name: key,
        valueType: 'array',
        children: backTrans(obj[key][0], type)
      })
    } else if (Array.isArray(obj[key]) && typeof obj[key][0] === 'object' && obj[key].length > 1 && type == 'query') {
      console.log(obj[key], 'obj[key]')
      const childrenArr = []
      obj[key].forEach((el, i) => {
        const arrItem = {}
        arrItem.name = i.toString()
        arrItem.valueType = 'object'
        arrItem.children = backTrans(obj[key][i], type)
        childrenArr.push(arrItem)
      })
      arr.push({
        name: key,
        valueType: 'array',
        children: childrenArr
      })
    } else if (Array.isArray(obj[key]) && typeof obj[key][0] !== 'object') {
      arr.push({
        name: key,
        valueType: 'array',
        value: obj[key]
      })
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      arr.push({
        name: key,
        valueType: 'object',
        children: backTrans(obj[key], type)
      })
    } else if (obj[key] == null) {
      const baseInfo = type == 'query' ? queryBaseInfo.value : responseBaseInfo.value
      const sameItem = baseInfo.filter(el => el.name == key)
      if (sameItem.length > 0 && sameItem[0].type == 'array') {
        arr.push({
          name: key,
          valueType: 'array',
          value: ''
        })
      } else {
        arr.push({
          name: key,
          valueType: 'string',
          value: ''
        })
      }
    } else if (typeof obj[key] === 'number' && obj[key] == 0) {
      arr.push({
        name: key,
        value: 0,
        valueType: typeof obj[key]
      })
    } else if (typeof obj[key] === 'boolean') {
      arr.push({
        name: key,
        value: obj[key],
        valueType: typeof obj[key]
      })
    } else {
      arr.push({
        name: key,
        value: obj[key] || '',
        valueType: typeof obj[key]
      })
    }
  }
  return arr
}

function checkSqlRequest(val, ischildren) {
  const obj = {
    check_field: []
  }
  if (ischildren) obj.check_sql = ''
  val.map(item => {
    if (item.checked) {
      obj.check_field.push(item.name)
      obj[item.name] = {}
      obj[item.name].check_sql = ''
      if (item.children) {
        obj[item.name] = checkSqlRequest(item.children, true)
      }
    }
  })
  return obj
}

const queryCheck = function () {
  childrenCheck(queryTableData.value)
}
function childrenCheck(val) {
  val.forEach((item, index) => {
    if (item.checked) {
      item.queryName = item.name
      item.queryValue = `$${item.name}`
    } else {
      delete item.queryName
      delete item.queryValue
    }
    if (item.children) {
      childrenCheck(item.children)
    }
  })
}
const responseCheck = function (val) {
  childrenResUrl(backTableData.value, '')
}
const getCheckBaseInfo = async function () {
  const data = {
    project_line_id: 1,
    group_type: 'plan'
  }
  const res = await axios({
    method: 'post',
    url: '/iftest/condition/group/list',
    data,
  })
  checkFuncList.value = []
  res.data.datasList.map(item => {
    checkFuncList.value.push({
      label: item.group_name,
      value: item.id
    })
  })

  const param = {
    curPage: 1,
    pageSize: 10
  }
  const res2 = await axios({
    method: 'post',
    url: '/iftest/functions/thirdFunc-list',
    data: param,
  })
  checkFuncSearchData.value = res2.data.datasList || []
  total.value = res2.data.total
}
let getIfaceDetail = async function (iface_id) {
  const data = { id: iface_id }
  formData.value.name = ''
  formData.value.address = ''
  formData.value.method = ''
  let applyTableBaseData = []
  let queryTableBaseData = []
  let backTableBaseData = []
  const res = await axios({
    method: 'post',
    url: '/iftest/iface/iface_detail',
    data,
  })
  const { req_headers, req_body, res_body, iface_name, request_url, request_method } = res.data
  formData.value.name = iface_name
  formData.value.address = request_url
  formData.value.method = request_method
  const req_headersJson = req_headers.replace(RegExp('[(]', 'g'), '').replace(RegExp('[)]', 'g'), '').replace(RegExp('ObjectId', 'g'), '')
  applyTableBaseData = JSON.parse(`[${req_headersJson}]`)
  if (typeof req_body === 'string' && req_body !== '') {
    if (req_body.indexOf('ObjectId') !== -1) {
      const req_bodyJson = req_body.replace(RegExp('[(]', 'g'), '').replace(RegExp('[)]', 'g'), '').replace(RegExp('ObjectId', 'g'), '')
      queryTableBaseData = JSON.parse(`[${req_bodyJson}]`)
      queryTableBaseData.forEach(item => item.description = item.desc)
    } else {
      const queryJson = JSON.parse(req_body.replace(/[\r|\n|\t]/g, ''))
      if (queryJson.items) {
        transObj(queryJson.items)
      } else if (queryJson.properties) {
        queryTableBaseData = transObj(queryJson)
      }
    }
  } else if (typeof req_body === 'object') {
    if (req_body.items) {
      queryTableBaseData = transObj(req_body.items)
    } else if (req_body.properties && !req_body.$$ref) {
      queryTableBaseData = transObj(req_body)
    } else if (req_body.properties && req_body.$$ref) {
      queryTableBaseData = objToTree(req_body.properties)
    }
  }
  if (res_body.items) {
    backTableBaseData = transObj(res_body.items)
  } else if (res_body.properties && !res_body.$$ref) {
    backTableBaseData = transObj(res_body)
  } else if (res_body.properties && res_body.$$ref) {
    backTableBaseData = objToTree(res_body.properties)
  }
  getQueryBaseArray(queryTableBaseData, 'query')
  getQueryBaseArray(backTableBaseData, 'response')
}
function getQueryBaseArray(val, type) {
  val.map(item => {
    if (type == 'query') {
      queryBaseInfo.value.push({
        name: item.name,
        type: item.type,
        required: item.required,
        description: item.description
      })
    } else if (type == 'response') {
      responseBaseInfo.value.push({
        name: item.name,
        type: item.type,
        required: item.required,
        description: item.description
      })
    }
    if (item.children) {
      getQueryBaseArray(item.children, type)
    }
  })
}
let transObj = function (obj) {
  const arr = []
  for (const key in obj.properties) {
    const itemObj = {
      name: key,
      type: obj.properties[key].type,
      description: obj.properties[key].description || ''
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
  const arr = []
  for (const key in obj) {
    // 判断每个值是不是一个对象
    if (typeof obj[key] === 'object') {
      if (obj[key].properties) {
        arr.push({
          name: key,
          type: obj[key].type,
          description: obj[key].description,
          children: objToTree(obj[key].properties),
          required: 0
        })
      } else if (obj[key].items) {
        arr.push({
          name: key,
          type: obj[key].type,
          description: obj[key].description,
          children: objToTree(obj[key].items.properties),
          required: 0,
          format: `item 类型:${obj[key].items.type}`
        })
      } else {
        const newobj = {
          name: key,
          type: obj[key].type,
          description: obj[key].description,
          required: 0,
        }
        obj[key].format ? newobj.format = obj[key].format : ''
        arr.push(newobj)
      }
    } else {
      arr.push({
        key: obj[key]
      })
    }
  }
  return arr
}

function getCaseVariable(val) {
  val.map(item => {
    if (item.checked) {
      case_variable.value[item.queryName] = item.queryValue
    }
    if (item.children) getCaseVariable(item.children)
  })
}
function getResultVariable(val) {
  val.map(item => {
    if (item.checked) {
      result_variable.value[item.resonseName] = item.responseUrl
    }
    if (item.children) getResultVariable(item.children)
  })
}

function addCaseVariable(val, key) {
  val.forEach(item => {
    if (item.name == key) {
      item.checked = true
      item.queryName = key
      item.queryValue = `$${key}`
    } else if (item.children) {
      addCaseVariable(item.children, key)
    }
  })
}
function addCaseVariable1(val, key, oldVal) {
  val.forEach(item => {
    if (item.name == key) {
      item.checked = true
      item.queryName = key
      item.queryValue = oldVal[key]
    } else if (item.children) {
      addCaseVariable1(item.children, key)
    }
  })
}

function addResultariable(val, arr, index, key, url) {
  if (arr.length == 0) return
  val.forEach(item => {
    if (item.name == arr[0]) {
      arr.shift()
      if (arr.length == 0) {
        item.resonseName = key
        item.responseUrl = url
        item.checked = true
      } else {
        addResultariable(item.children, arr, index, key, url)
      }
    }
  })
}
const checkSqlList = ref([])
const checkedList = ref([])
const funcData = ref([])
const getEditData = async function () {
  tableParams.case_variable = JSON.parse(tableParams.case_variable)
  tableParams.header = JSON.parse(tableParams.header)
  tableParams.request_param = JSON.parse(tableParams.request_param)
  tableParams.response = JSON.parse(tableParams.response)
  tableParams.result_check = JSON.parse(tableParams.result_check)
  tableParams.result_variable = JSON.parse(tableParams.result_variable)
  formData.value.case_title = tableParams.case_title
  formData.value.case_desc = tableParams.case_desc
  formData.value.version = tableParams.version
  formData.value.case_type = tableParams.case_type
  formData.value.wait_time = tableParams.wait_time

  funcData.value = Object.values(JSON.parse(tableParams.generic_variables)).map(v => ({
    ...v,
    fun_param: JSON.stringify(v.fun_param)
  }))

  applyTableData.value = []
  for (var key in tableParams.header) {
    applyTableData.value.push({
      name: key,
      value: tableParams.header[key]
    })
  }
  let applyTableBaseData = []
  const data = { id: tableParams.iface_id }
  const res = await axios({
    method: 'post',
    url: '/iftest/iface/iface_detail',
    data,
  })
  const req_headersJson = res.data.req_headers.replace(RegExp('[(]', 'g'), '').replace(RegExp('[)]', 'g'), '').replace(RegExp('ObjectId', 'g'), '')
  applyTableBaseData = JSON.parse(`[${req_headersJson}]`)
  headerBaseInfo.value = applyTableBaseData
  applyTableData.value.forEach(i => {
    const sameItem = headerBaseInfo.value.find(e => e.name == i.name)
    if (sameItem) {
      i.required = sameItem.required
    }
  })
  queryTableData.value = backTrans(tableParams.request_param, 'query')
  backTableData.value = backTrans(tableParams.response, 'response')
  console.log(tableParams.case_variable)
  for (var key in tableParams.case_variable) {
    addCaseVariable1(queryTableData.value, key, tableParams.case_variable)
  }
  for (var key in tableParams.result_variable) {
    const arr = tableParams.result_variable[key].replace(/\[|]/g, '').replace(RegExp('0', 'g'), '').split('.')
    addResultariable(backTableData.value, arr, 0, key, tableParams.result_variable[key])
  }
  checkSql.request = tableParams.result_check.request.check_sql
  checkSql.response = tableParams.result_check.response.check_sql
  getAllChecked(tableParams.result_check.response)
  getRequestAllChecked(tableParams.result_check.request)
  checkForm.wait_time = tableParams.result_check.wait_time
  const param = {
    curPage: 1,
    pageSize: 10,
    en_name: tableParams.result_check.third_fun.split(',')
  }
  const res2 = await axios({
    method: 'post',
    url: '/iftest/functions/thirdFunc-list',
    data: param,
  })
  checkFuncTableData.value = res2.data.datasList || []
  addBaseInfo(queryTableData.value, 'query')
  addBaseInfo(backTableData.value, 'response')
}
let headerBaseInfo = ref([])

function getAllChecked(val) {
  val.check_field.forEach(item => {
    checkSqlList.value.push({ name: item, sql: val[item].check_sql })
    if (val[item].check_field && val[item].check_field.length > 0) {
      getAllChecked(val[item])
    }
  })
}
function getRequestAllChecked(val) {
  val.check_field.forEach(item => {
    checkedList.value.push(item)
    if (val[item].check_field && val[item].check_field.length > 0) {
      getRequestAllChecked(val[item])
    }
  })
}
onMounted(() => {
  getAllMsg()
})

</script>
<style lang="css" scoped>
.atomicDetail {
  padding: 0px 15px
}

.widthMax {
  width: 100%;
  padding: 0px 25px;
  /* background-color: #f5f7fa; */
  border-bottom: 1px solid #dedfe0;
  height: 450px;
  overflow: auto;
  border-top: 1px solid #dedfe0;
}

.widthMin {
  width: 80%;
}
::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
</style>
