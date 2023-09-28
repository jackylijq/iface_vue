<template>
    <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="90px" class="baseForm">
        <el-row>
            <el-col :span="9">
                <el-form-item label="接口名称">
                    <el-input disabled v-model="formData.name" />
                </el-form-item>
            </el-col>
            <el-col :span="9">
                <el-form-item label="接口地址">
                    <el-input disabled v-model="formData.address" />
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="接口版本">
                    <el-input disabled v-model="formData.version" />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="9">
                <el-form-item label="用例名称">
                    <el-input disabled v-model="formData.case_title" />
                </el-form-item>
            </el-col>
            <el-col :span="9">
                <el-form-item label="用例类型" prop="case_type">
                    <el-select placeholder="请选择" width="100%" v-model="formData.case_type" disabled >
                        <el-option key="正常" label="正常" value="正常"></el-option>
                        <el-option key="异常" label="异常" value="异常"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="等待时间" prop="wait_time">
                    <el-input-number disabled controls-position="right" :min="0" style='width:calc(100% - 20px);height:32px' v-model="formData.wait_time" />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="18">
                <el-form-item label="用例描述" prop="case_desc">
                    <el-input :rows="2" type="textarea" v-model="formData.case_desc" disabled />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<script setup>
import { defineProps, watch } from 'vue'

const props = defineProps({
  formData: {
    type: Object
  }
})

</script>
<style lang="css" scoped>
.baseForm {
    padding-top: 10px;
    /* width: 80% */
}
::v-deep .el-form-item__label {
    padding: 0 10px 0 0;
}
</style>
