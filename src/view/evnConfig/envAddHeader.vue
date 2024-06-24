<template>
  <el-table :data="tableData" style="max-width: 1000px">
    <el-table-column prop="pro_name" label="Header名称">
      <template #default="scope">
        <el-select
          v-model="scope.row.key"
          filterable
          allow-create
          :disabled="disabledContentType && scope.row.key === 'Content-Type'"
          placeholder="请选择请求头名称"
          style="width: 100%"
        >
          <el-option v-for="item in computedHeaderList(scope)" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="pro_name" label="Header内容">
      <template #default="scope">
        <el-input v-model="scope.row.value" placeholder="请输入Header内容" />
      </template>
    </el-table-column>
    <el-table-column prop="address" label="操作" width="180">
      <template #default="scope">
        <el-button type="primary" size="small" @click="addHeader(scope)">增加</el-button>
        <el-button
          type="danger"
          v-show="!disabledContentType || scope.row.key !== 'Content-Type'"
          size="small"
          @click="delHeader(scope)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
import { computed } from 'vue'
let props = defineProps({
  disabledContentType: {
    type: Boolean,
    default: true,
  },
  tableData: {
    type: Array,
    default: [],
  },
})

let headerList = [
  'Accept',
  'Accept-Charset',
  'Accept-Encoding',
  'Accept-Language',
  'Accept-Datetime',
  'Authorization',
  'Cache-Control',
  'Connection',
  'Cookie',
  'Content-Type',
]

let headerListSelected = computed(() => {
  return props.tableData.map(v => v.key)
})

function computedHeaderList(scope) {
  return [...headerList.filter(v => !headerListSelected.value.some(e => v === e)), scope.row.key]
}

function addHeader(scope) {
  props.tableData.splice(scope.$index + 1, 0, { key: computedHeaderList(scope)[0], value: '' })
}
function delHeader(scope) {
  if (props.tableData.length > 1) {
    props.tableData.splice(scope.$index, 1)
  } else {
    props.tableData[0] = {
      key: '',
      value: '',
    }
  }
}
</script>
<style lang="scss" scoped></style>
