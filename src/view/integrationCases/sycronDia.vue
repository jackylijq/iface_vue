<template>
  <el-dialog :modelValue="value" top="4vh" title="选择用例" width="1080px" @close="emits('input', false)">
    <el-table :data="tableData">
      <el-table-column label="数据类型" prop="type" width="90"></el-table-column>
      <el-table-column label="原子用例" prop="atomic">
        <template #default="{ row, $index }">
          <el-input type="textarea" :rows="9" :disabled="$index <= 2" placeholder="请输入内容" v-model="row.atomic">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="当前集成用例" prop="inte">
        <template #default="{ row, $index }">
          <el-input type="textarea" :rows="9" :disabled="$index <= 2" placeholder="请输入内容" v-model="row.inte">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="同步后集成用例" prop="inte_combine">
        <template #default="{ row }">
          <el-input type="textarea" :rows="9" placeholder="请输入内容" v-model="row.inte_combine"> </el-input>
        </template>
      </el-table-column>
      <el-table-column label="是否同步" width="90">
        <template #default="{ row, $index }">
          <el-checkbox v-model="row.ifSycron" :disabled="$index <= 1" @change="handleChange"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emits('input', false)">取消</el-button>
        <el-button type="primary" @click="emits('submit', tableData)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { defineProps, onMounted, ref, defineEmits, watch, watchEffect } from 'vue'
let props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  sycronDiaInfo: {},
})

let emits = defineEmits(['input', 'save'])

let tableData = ref([
  {
    type: '用例参数',
    ifSycron: true,
    atomic: '',
    inte: '',
    inte_combine: '',
  },
  {
    type: '结果变量',
    ifSycron: true,
    atomic: '',
    inte: '',
    inte_combine: '',
  },
  {
    type: '结果检查',
    ifSycron: true,
    atomic: '',
    inte: '',
    inte_combine: '',
  },
])

watch(
  () => {
    return props.value
  },
  () => {
    if (props.value) {
      tableData.value[0].atomic = JSON.stringify(props.sycronDiaInfo.atomic.case_variable || {}, null, 2)
      tableData.value[1].atomic = JSON.stringify(props.sycronDiaInfo.atomic.result_variable || {}, null, 2)
      tableData.value[2].atomic = JSON.stringify(props.sycronDiaInfo.atomic.result_check || {}, null, 2)

      tableData.value[0].inte = JSON.stringify(props.sycronDiaInfo.inte.case_variable || {}, null, 2)
      tableData.value[1].inte = JSON.stringify(props.sycronDiaInfo.inte.result_variable || {}, null, 2)
      tableData.value[2].inte = JSON.stringify(props.sycronDiaInfo.inte.result_check || {}, null, 2)

      tableData.value[0].inte_combine = JSON.stringify(props.sycronDiaInfo.inte_combine.case_variable || {}, null, 2)
      tableData.value[1].inte_combine = JSON.stringify(props.sycronDiaInfo.inte_combine.result_variable || {}, null, 2)
      tableData.value[2].inte_combine = JSON.stringify(props.sycronDiaInfo.inte_combine.result_check || {}, null, 2)
      records_inte_combine = tableData.value[2].inte_combine
    }
  },
)

// 记录结果检查
let records_inte_combine = ''
let handleChange = function (val) {
  if (val) {
    tableData.value[2].inte_combine = records_inte_combine
  } else {
    records_inte_combine = tableData.value[2].inte_combine
    tableData.value[2].inte_combine = tableData.value[1].inte_combine
  }
}
</script>
<style lang="scss" scoped>
.scron-header {
  width: 100%;
  display: flex;

  li {
    flex-grow: 1;
  }
}
</style>
