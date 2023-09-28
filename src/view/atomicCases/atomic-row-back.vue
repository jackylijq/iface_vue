<template>
    <el-table :data="tableData" :default-expand-all="true" stripe class="headerTable" row-key="name"
        :tree-props="{ children: 'children' }">
        <el-table-column :show-overflow-tooltip="true" prop="name" label="参数名称" />
        <el-table-column :show-overflow-tooltip="true" prop="type" label="类型" />
        <el-table-column :show-overflow-tooltip="true" prop="required" label="是否必须" :formatter="change" >
          <template v-slot="{ row }">
              {{ row.required ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="value" label="默认值" />
        <el-table-column :show-overflow-tooltip="true" prop="description" label="字段含义" />
        <el-table-column :show-overflow-tooltip="true" prop="value" label="是否参数化">
            <template v-slot="scope">
                <el-checkbox disabled v-model="scope.row.checked">{{ scope.row.checked ? '是' : '否' }}</el-checkbox>
            </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="resonseName" label="参数化名称">
            <template v-slot="scope">
                <el-input disabled v-model="scope.row.resonseName"></el-input>
            </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="responseUrl" label="参数路径" />
    </el-table>
</template>
<script setup>
import { defineProps, watch } from 'vue'

const props = defineProps({
  tableData: {
    type: Array
  }
})

</script>
<style lang="css" scoped>
.headerTable {
    /* width: 80%; */
}
::v-deep .el-table__expand-icon {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
::v-deep .el-table__expand-icon .el-icon{
  display:none !important;
}
::v-deep .el-table__expand-icon:before {
  background: url("../../assets/image/table/open.png") no-repeat;
  content: "";
  display: block;
  width: 15px;
  height: 20px;
  font-size: 18px;
  background-size: 14px;
  margin-top: 4px;
}

::v-deep .el-table__expand-icon--expanded:before {
  background: url("../../assets/image/table/close.png") no-repeat;
  content: "";
  display: block;
  width: 15px;
  height: 20px;
  font-size: 18px;
  background-size: 14px;
  margin-top: 4px;
}
</style>
