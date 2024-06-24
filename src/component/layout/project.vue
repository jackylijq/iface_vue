<template>
  <el-select style="margin-right: 20px" v-model="pro_line_id" placeholder="" @change="handleChanged" >
    <el-option v-for="item in projectData" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>
<script setup>
import { ref, unref } from 'vue'
import router from '@/router'
import axios from '@/lin/plugin/axios'
import store from '@/store'
import emitter from 'lin/util/emitter'
import * as types from '@/store/mutation-type'

const pro_line_id = ref('')
const projectData = ref([])
const initProjectData = async function () {
  let res = await axios({
    method: 'post',
    url: '/iftest/product/proLinList',
  })
  projectData.value = res.data.datasList.map(v => ({
    label: v['pro_line_name'],
    value: v.id,
  }))
  setDefaultProjectValue()
  handleChanged(pro_line_id.value)
}
initProjectData()

/**
 * 设置项目默认值
 */
const setDefaultProjectValue = function () {
  let findProject = unref(projectData).find(v => v.value == store.getters.project.id)
  if (findProject) {
    pro_line_id.value = findProject.value
  } else {
    pro_line_id.value = unref(projectData)[0].value
    
  }
}
const handleChanged = function (newV) {
  store.commit(types.SET_PROJECT_ID, newV)

  let { path, query } = unref(router.currentRoute)
  emitter.emit('clearTap')
  router.replace({
    path,
    query: {
      ...query,
      pro_line_id: newV,
    },
  })
}
</script>
