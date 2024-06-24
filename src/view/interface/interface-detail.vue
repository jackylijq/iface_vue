<template>
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
      <el-table :data="applyTableData" stripe style="width: 100%">
        <el-table-column :show-overflow-tooltip="true" prop="name" label="参数名称" />
        <el-table-column :show-overflow-tooltip="true" prop="value" label="参数值" />
        <el-table-column :show-overflow-tooltip="true" prop="required" label="是否必须" :formatter="change" />
        <el-table-column :show-overflow-tooltip="true" prop="t3" label="示例" />
        <el-table-column :show-overflow-tooltip="true" prop="desc" label="备注" />
      </el-table>
      <div class="applyTitle">Query:</div>
      <el-table :data="queryTableData" stripe style="width: 100%" :tree-props="{ children: 'children' }" row-key="name">
        <el-table-column :show-overflow-tooltip="true" prop="name" label="参数名称" />
        <el-table-column :show-overflow-tooltip="true" prop="type" label="参数类型" />
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
<script setup>
import axios from '@/lin/plugin/axios'
import { defineProps, reactive, unref, ref, watchEffect } from 'vue'
let props = defineProps({
  iface_id: {},
})

let formData = reactive({
  name: '',
  address: '',
  method: '',
})

let queryTableData = ref([])
let applyTableData = ref([])
let backTableData = ref([])
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
  if (typeof req_headers == 'string' && req_headers !== '') {
    let req_headersJson = req_headers
    .replace(RegExp('[(]', 'g'), '')
    .replace(RegExp('[)]', 'g'), '')
    .replace(RegExp('ObjectId', 'g'), '')
    applyTableData.value = new Function(`return [${req_headersJson}]`)()
  }else{
    applyTableData.value = req_headers
  }
  
  if (typeof req_body == 'string' && req_body !== '') {
    if (req_body.indexOf('ObjectId') !== -1) {
      let req_bodyJson = req_body
        .replace(RegExp('[(]', 'g'), '')
        .replace(RegExp('[)]', 'g'), '')
        .replace(RegExp('ObjectId', 'g'), '')
      queryTableData.value = new Function(`return [${req_bodyJson}]`)()
      queryTableData.value.forEach(item => (item.description = item.desc))
    } else {
      let queryJson = new Function(`return ${req_body.replace(/[\r|\n|\t]/g, '')}`)
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

watchEffect(() => {
  getIfaceDetail(props.iface_id)
})
</script>
<style lang="scss" scoped>
.title {
  font-size: 16px;
  color: #000000d8;
  margin: 20px 0 20px 20px;
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
