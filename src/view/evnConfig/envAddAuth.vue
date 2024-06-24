<template>
  <el-table :data="tableData" style="max-width: 1000px">
    <el-table-column prop="key" label="key">
      <template #default="scope">
        <el-input v-model="scope.row.key" placeholder="请输入参数名" />
      </template>
    </el-table-column>
    <el-table-column prop="value" label="value">
      <template #default="scope">
        <el-input v-model="scope.row.value" placeholder="请输入参数值" />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180">
      <template #default="scope">
        <el-button type="primary" size="small" @click="add(scope)">增加</el-button>
        <el-button type="danger" size="small" @click="del(scope)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
let props = defineProps({
  tableData: {
    type: Array,
    default: [],
  },
})

function add(scope) {
  props.tableData.splice(scope.$index + 1, 0, { key: '', value: '' })
}

function del(scope) {
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
