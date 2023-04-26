<template>
  <div>
    <span>执行环境：</span>
    <el-select v-model="selectValue.branch" @change="handleChange" class="m-2" placeholder="请选择执行环境">
      <el-option v-for="item in options" :key="item.id" :label="item.env_name" :value="item.branch" />
    </el-select>
  </div>
  <div>
    <span>host地址：</span>
    <p>{{ selectValue.env_host }}</p>
  </div>
  <div>
    <span>数据库信息：</span>
    <p>{{ selectValue.db_host }}:{{ selectValue.db_port }}</p>
  </div>
</template>
<script setup>
import { defineEmits, ref, onMounted, reactive, unref } from 'vue'
import axios from '@/lin/plugin/axios'

let selectValue = reactive({
  branch: '',
  env_host: '',
  db_host: '',
  db_port: '',
})
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
    let { branch, env_host, db_host, db_port } = options.value[0]
    selectValue.branch = branch
    selectValue.env_host = env_host
    selectValue.db_host = db_host
    selectValue.db_port = db_port
    emits('input', selectValue.branch)
  }
}

let handleChange = v => {
  let { env_host, db_host, db_port } = unref(options).find(e => e.branch === v)
  selectValue.env_host = env_host
  selectValue.db_host = db_host
  selectValue.db_port = db_port
  emits('input', v)
}

onMounted(() => getOptions())
</script>
<style lang="scss" scoped>
div {
  display: flex;

  height: 32px;
  line-height: 32px;

  > span {
    display: inline-block;
    width: 85px;
    text-align: right;
    // padding-right: 4px;
  }
  > p {
    line-height: inherit;
  }
}
</style>
