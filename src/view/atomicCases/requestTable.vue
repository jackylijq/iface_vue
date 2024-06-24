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
          :expanded-row-keys="expandedRowKeys"
        />
      </template>
    </el-auto-resizer>
  </div>
</template>
<script setup lang="jsx">
import { ElCheckbox, ElIcon, ElInput } from 'element-plus'
let props = defineProps({
  data: Array,
  expandedRowKeys: Array,
  disabled: Boolean,
})

function childrenChanged(val, children = []) {
  children.forEach(ele => {
    checkboxChanged(val, ele)
  })
}
function checkboxChanged(val, row) {
  row.checked = val
  if (val) {
    row.queryName = row.name
    row.queryValue = `\${${row.name}}`
  } else {
    delete row.queryName
    delete row.queryValue
  }
  if (row.children) {
    childrenChanged(val, row.children)
  }
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
    cellRenderer: ({ rowData }) => {
      let text = rowData.required == '0' ? '否' : rowData.required == '1' ? '是' : ''
      return <span>{text}</span>
    },
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
    cellRenderer: ({ rowData }) => {
      return (
        <ElInput
          modelValue={rowData.value}
          disabled={props.disabled}
          onUpdate:modelValue={val => (rowData.value = val)}
          size="small"
          placeholder="请输入参数值"
        />
      )
    },
  },
  {
    key: 'checked',
    title: '是否参数化',
    dataKey: 'checked',
    width: 150,
    cellRenderer: ({ rowData }) => {
      return (
        <ElCheckbox
          disabled={props.disabled}
          modelValue={rowData.checked}
          onUpdate:modelValue={val => checkboxChanged(val, rowData)}
        >
          {rowData.checked ? '是' : '否'}
        </ElCheckbox>
      )
    },
  },
  {
    key: 'queryName',
    title: '参数化名称',
    dataKey: 'queryName',
    width: 150,
  },
  {
    key: 'queryValue',
    title: '参数化值',
    dataKey: 'queryValue',
    width: 150,
    cellRenderer: ({ rowData }) => {
      return (
        <ElInput
          disabled={props.disabled}
          modelValue={rowData.queryValue}
          onUpdate:modelValue={val => (rowData.queryValue = val)}
          size="small"
          placeholder="请输入参数值"
        />
      )
    },
  },
]
</script>

<style scoped lang="scss">
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
</style>
