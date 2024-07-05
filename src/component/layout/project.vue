<template>
  <div style="display: flex; align-items: center; margin-right: 10px">
    <el-select style="" v-model="pro_line_id" placeholder="" @change="handleChanged">
      <el-option v-for="item in projectData" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>

    <!-- 新增项目 -->
    <el-tooltip content="新增项目">
      <svg
        style="margin-left: 10px; cursor: pointer"
        @click="projectAddVisible = true"
        t="1719304367309"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2607"
        width="28"
        height="28"
      >
        <path d="M832 768.4V640.7h-64v127.7H640v63.9h128V960h64V832.3h128v-63.9z" fill="#669E8B" p-id="2608"></path>
        <path d="M832 768.4V640.7h-64v127.7H640v63.9h128V960h64V832.3h128v-63.9z" fill="#669E8B" p-id="2609"></path>
        <path
          d="M728 301.9c0 10.5-5.2 20.3-13.8 26.3L413.9 535.3c-5.5 3.8-11.8 5.7-18.2 5.7-6.4 0-12.7-1.9-18.2-5.7L77.8 328.8c-8.6-6-13.8-15.8-13.8-26.3s5.2-20.3 13.8-26.3L378.1 69.6c10.9-7.5 25.4-7.5 36.3 0l299.7 206c8.7 6 13.9 15.8 13.9 26.3z"
          fill="#E6C37C"
          p-id="2610"
        ></path>
        <path
          d="M395.7 713.2c-6.4 0-12.7-1.9-18.2-5.7L77.8 501c-14.5-10-18.2-29.9-8.1-44.4 10-14.5 30-18.1 44.5-8.1l281.5 194 282.1-194.6c14.5-10 34.5-6.4 44.5 8.1s6.4 34.4-8.1 44.4L413.9 707.6c-5.5 3.7-11.8 5.6-18.2 5.6z"
          fill="#E6C37C"
          p-id="2611"
        ></path>
        <path
          d="M576 704.6h104.5l23.5-16.2v-64.2c-8.7-2.2-18.2-0.8-26.2 4.6L395.7 823.4l-281.5-194c-14.5-10-34.5-6.4-44.5 8.1s-6.4 34.4 8.1 44.4l299.7 206.6c5.5 3.8 11.8 5.7 18.2 5.7 6.4 0 12.7-1.9 18.2-5.7L576 776.7v-72.1z"
          fill="#E6C37C"
          p-id="2612"
        ></path>
      </svg>
    </el-tooltip>

    <ProjectAdd v-model="projectAddVisible" @submit="handleSubmitUserAdd" @cancel="projectAddVisible = false" />
  </div>
</template>
<script setup>
import { ref, unref } from 'vue'
import router from '@/router'
import axios from '@/lin/plugin/axios'
import store from '@/store'
import emitter from 'lin/util/emitter'
import * as types from '@/store/mutation-type'
import ProjectAdd from './projectAdd.vue'
import { method } from 'lodash'
import { ElMessage } from 'element-plus'
const pro_line_id = ref('')
const projectData = ref([])
const initProjectData = async function () {
  let connectRes = await axios({
    method: 'POST',
    url: '/iftest/product/userProLine',
    data: {
      user_id: store.getters.user.id,
    },
  })

  let defaultProject = connectRes.data.datasList[0]?.default_id

  let res = await axios({
    method: 'post',
    url: '/iftest/product/proLinList',
  })
  projectData.value = res.data.datasList
    .map(v => ({
      label: v['pro_line_name'],
      value: v.id,
    }))
    .filter(v => connectRes.data.datasList[0].pro_line_list.includes(v.value))

  await setDefaultProjectValue(defaultProject)
  handleChanged(pro_line_id.value)
}
initProjectData()

/**
 * 设置项目默认值
 */
const setDefaultProjectValue = async function (defaultValue) {
  // 获取地址栏pro_line_id设置默认项目
  let { pro_line_id: query_pro_line_id } = unref(router.currentRoute).query
  if (query_pro_line_id) {
    let findDefault = unref(projectData).find(v => v.value == query_pro_line_id)
    if (findDefault) {
      pro_line_id.value = +query_pro_line_id
      return
    }
  }

  // 用户默认项目
  if (defaultValue) {
    let findDefault = unref(projectData).find(v => v.value == defaultValue)
    if (findDefault) {
      pro_line_id.value = defaultValue
      return
    }
  }

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

let projectAddVisible = ref(false)
async function handleSubmitUserAdd(data) {
  let edit_uid = store.getters.user.username
  let user_id = store.getters.user.id
  let res = await axios({
    method: 'POST',
    url: '/iftest/product/proLineAdd',
    data: {
      ...data,
      edit_uid,
      user_id,
    },
  })

  ElMessage({
    type: res.code === 200 ? 'success' : 'error',
    message: res.message,
  })

  if (res.code === 200) {
    projectAddVisible.value = false
  }
}
</script>
