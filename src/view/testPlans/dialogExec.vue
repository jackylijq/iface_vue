<template>
  <div>
    执行环境：<el-select
      v-model="selectValue"
      @change="v => emits('input', v)"
      class="m-2"
      placeholder="请选择执行环境"
    >
      <el-option v-for="item in options" :key="item.id" :label="item.env_name" :value="item.branch" />
    </el-select>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue'
import axios from '@/lin/plugin/axios'

let selectValue = ref('') //branch
let emits = defineEmits(['input'])

let options = ref([])
let getOptions = async function () {
  let res = await axios({
    method: 'GET',
    url: '/iftest/dispose/env/list',
    params: {
      curPage: 1,
      pageSize: 100,
    },
  })

  options.value = res.data.datasList
  if (options.value.length > 0) {
    selectValue.value = options.value[0].branch
    emits('input', selectValue.value)
  }
}
onMounted(() => getOptions())
</script>
<style lang="scss" scoped></style>
