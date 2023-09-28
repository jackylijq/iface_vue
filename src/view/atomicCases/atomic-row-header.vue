<template>
    <el-table :data="headerData" :default-expand-all="true" stripe class="headerTable" row-key="index"
        :tree-props="{ children: 'children' }">
        <el-table-column :show-overflow-tooltip="true" prop="name" label="参数名称">
            <template v-slot="{ row }">
                <el-input disabled v-model="row.name" size="small"></el-input>
            </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="required" label="是否必须" >
            <template #default="{ row }">
                {{ row.required == 1 ? '是' : '' }}
            </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="desc" label="备注" />
        <el-table-column :show-overflow-tooltip="true" prop="value" label="参数值">
            <template v-slot="scope">
                <el-input disabled v-model="scope.row.value" size="small"></el-input>
            </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" v-if="false">
            <template v-slot="scope">
                <i class="el-icon-circle-plus-outline" style="font-size:20px;margin:0 18px;cursor: pointer;"></i>
                <i class="el-icon-delete" style="font-size:20px;cursor: pointer;" v-show="scope.row.name !== 'Content-Type' && scope.row.name !== 'username' && scope.row.name !== 'password'"></i>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  headerData: {
    type: Array
  }
})

</script>
<style lang="css" scoped>
.headerTable {
    /* width: 80%; */
}
</style>
