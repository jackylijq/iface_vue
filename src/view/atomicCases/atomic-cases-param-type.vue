<template>
  <div>
    参数格式:
    <el-select v-model="props.formData.req_body_type" class="m-2" style="width: 200px;" placeholder="" size="mini" clearable >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
const props = defineProps(['formData']) //req_body_type

const options = [
  {
    label: 'raw',
    value: 'raw',
  },
  {
    label: 'json',
    value: 'json',
  },
  {
    label: 'form-data',
    value: 'form-data',
  },
  {
    label: 'form-urlencoded',
    value: 'form-urlencoded',
  },
  {
    label: 'params',
    value: 'params',
  },
]
</script>
<style lang="scss" scoped>
div {
  display: inline-block;
  padding-left: 10px;
  font-size: 12px;
  width: calc(100% - 200px)
}
</style>
