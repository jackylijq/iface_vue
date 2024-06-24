<template>
  <div>
    <span
      >响应码字段:<el-select
        v-model="formData.code_name"
        style="width: 200px"
        placeholder=""
        size="mini"
        clearable
      >
        <el-option
          v-for="item in computedCodeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        /> </el-select
    ></span>
    <span style="margin-left: 10px">响应码值: </span>
    <el-input v-model="formData.res_code" style="width: 200px" placeholder="请输入"></el-input>
  </div>
</template>
<script setup>
import { computed, defineProps, watch, watchEffect } from 'vue'
const props = defineProps(['formData', 'backTableData']) //result_check.res_code
// let computedIsShow = computed(() => props.backTableData.find(v => v.name === props.formData.code_name))

let computedCodeList = computed(() =>
  props.backTableData
    .filter(v => ['string', 'number'].includes(v.type))
    .map(v => ({
      label: v.name,
      value: v.name,
    })),
)
</script>

<style lang="scss" scoped>
div {
  display: inline-block;
  padding-left: 10px;
  font-size: 12px;
  width: calc(100% - 200px);
}
</style>
