<template>
  <div>
    <el-table ref="refTable" :data="tableData" stripe style="width: 100%">
      <el-table-column type="selection" width="55" :selectable="selectable" />
      <el-table-column label="项目名称">
        <template #default="scope">{{ scope.row.pro_line_name }}</template>
      </el-table-column>
      <el-table-column label="设置默认">
        <template #default="scope">
          <el-switch :disabled="!selectable(scope.row)" v-model="scope.row.default" @change="val => handleChange(val, scope)"></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end; margin-top: 10px">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { nextTick, ref, unref } from 'vue'
import axios from '@/lin/plugin/axios'
import { getProjectData } from '../evnConfig/api'
import { useUser } from '../evnConfig/uid'

let props = defineProps({
  user_id: String,
})
let loginProduct = ref([])
let refTable = ref()
let tableData = ref([])
let { uid } = useUser()
async function getTableData() {
  // 获取登录用户项目
  let loginRes = await axios({
    method: 'POST',
    url: '/iftest/product/userProLine',
    data: {
      user_id: uid,
    },
  })
  loginProduct.value = loginRes.data.datasList[0]?.pro_line_list || []

  // 获取关联用户项目
  let connectRes = await axios({
    method: 'POST',
    url: '/iftest/product/userProLine',
    data: {
      user_id: props.user_id,
    },
  })
  let connectData = connectRes.data.datasList?.[0] || {}

  // 获取全部产品
  let res = await getProjectData()

  tableData.value = res.data.datasList //loginRes.data.datasList[0]?.pro_line_list.map(v => res.data.datasList.find(e => e.id === v))
  nextTick(() => {
    tableData.value.forEach(ele => {
      ele.default = connectData.default_id === ele.id
      unref(refTable).toggleRowSelection(ele, !!connectData.pro_line_list?.find(v => v === ele.id))
    })
  })
}
getTableData()

function selectable(row, index) {
  return unref(loginProduct).indexOf(row.id) > -1
}

let emits = defineEmits(['submit', 'cancel'])
async function submit() {
  emits('submit', {
    pro_line_list: unref(refTable)
      .getSelectionRows()
      .map(v => v.id),
    default_id: unref(tableData).find(v => v.default)?.id,
  })
}

function cancel() {
  emits('cancel')
}

function handleChange(val, scope) {
  if (val === true) {
    tableData.value.forEach(ele => {
      ele.default = scope.row.id === ele.id
    })
  }
}
</script>
<style lang="scss" scoped></style>
