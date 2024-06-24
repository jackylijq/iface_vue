<template>
  <div class="request-table" style="height: 400px; margin-left: 20px">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          :columns="columns"
          expand-column-key="name"
          :data="data"
          :width="width"
          :height="height"
          fixed
          :expanded-row-keys="expandedRowKeys"
        />
      </template>
    </el-auto-resizer>
  </div>
</template>
<script setup lang="jsx">
import { ElCheckbox } from 'element-plus'
let props = defineProps({
  data: Array,
  expandedRowKeys: Array,
  isCheckedFn: Function,
})
function checkboxChanged(val, row) {
  row.isChecked = val
  props.isCheckedFn?.(row)
}

const columns = [
  {
    key: 'name',
    title: '参数名称',
    dataKey: 'name',
    width: 300,
    minWidth: 150,
  },
  {
    key: 'type',
    title: '参数类型',
    dataKey: 'type',
    width: 150,
  },
  {
    key: 'required',
    title: '是否必须',
    dataKey: 'required',
    width: 150,
  },
  {
    key: 'description',
    title: '字段含义',
    dataKey: 'description',
    width: 150,
  },
  {
    key: 'value',
    title: '参数值',
    dataKey: 'value',
    width: 150,
  },
  {
    key: 'isChecked',
    title: '是否检查',
    dataKey: 'isChecked',
    width: 150,
    cellRenderer: ({ rowData }) => {
      return (
        <ElCheckbox modelValue={rowData.isChecked} onUpdate:modelValue={val => checkboxChanged(val, rowData)}>
          {rowData.isChecked ? '是' : '否'}
        </ElCheckbox>
      )
    },
  },
]
</script>
<style scoped lang="scss">
.request-table {
  .request-table {
  ::v-deep .el-table-v2__expand-icon {
    svg {
      display: none;
    }
  }
  ::v-deep .el-table-v2__expand-icon:not(.is-expanded):before {
    background: url('../../assets/image/table/open.png') no-repeat;
    content: '';
    display: inline-block;
    width: 15px;
    height: 20px;
    font-size: 18px;
    background-size: 14px;
    margin-top: 4px;
    margin-left: -2px;
  }

  ::v-deep .el-table-v2__expand-icon.is-expanded::before {
    background: url('../../assets/image/table/close.png') no-repeat;
    content: '';
    display: inline-block;
    width: 15px;
    height: 20px;
    font-size: 18px;
    background-size: 14px;
    margin-top: 4px;
    margin-left: -2px;
  }
}
}
</style>