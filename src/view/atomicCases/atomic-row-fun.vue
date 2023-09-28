<template>
    <el-table :data="funcData" :default-expand-all="true" stripe class="headerTable" row-key="index"
        :tree-props="{ children: 'children' }">
        <el-table-column type="index" width="80" label="编号" />
        <el-table-column :show-overflow-tooltip="true" prop="en_name" label="英文名称" />
        <el-table-column :show-overflow-tooltip="true" prop="cn_name" label="中文名称" />
        <el-table-column :show-overflow-tooltip="true" prop="variable_name" label="变量名称">
            <template v-slot="scope">
                <el-input v-model="scope.row.variable_name" size="small" disabled></el-input>
            </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="fun_param" label="函数参数">
            <template v-slot="scope">
                <el-input v-model="scope.row.fun_param" size="small" disabled></el-input>
            </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="preview" label="预览值" />
        <el-table-column :show-overflow-tooltip="true" prop="" label="">
            <template v-slot="scope">
                <i class="el-icon-view" style="font-size:20px;margin:0 18px;cursor: pointer;"
                    @click="previewHeaderInfo(scope)"></i>
                <i class="el-icon-delete" style="font-size:20px;cursor: pointer;" @click="deleteFunInfo(scope)"
                    v-show="scope.row.name !== 'Content-Type' && scope.row.name !== 'username' && scope.row.name !== 'password'"
                    v-if="false"></i>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup>
import { defineProps } from 'vue'
import axios from '@/lin/plugin/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  funcData: {
    type: Array
  }
})

const previewHeaderInfo = async function ({ row, $index }) {
  const res = await axios({
    method: 'post',
    url: '/iftest/functions/varPreview',
    data: {
      pageSize: 10,
      en_name: row.en_name,
      ...row,
      fun_param: JSON.parse(row.fun_param)
    }
  })
  ElMessage({
    type: res.code === 200 ? 'success' : 'error',
    message: res.message,
  })

  row.preview = res.data.variable_value
}
</script>
<style lang="css" scoped></style>
