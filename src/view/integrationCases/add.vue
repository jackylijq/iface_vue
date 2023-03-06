<template>
  <div class="integration-cases-add">
    <header class="integration-cases-add-header">
      <span class="float-l"><!-- <i class="iconfont icon-fanhui"></i> 返回--></span>
      <span @click="handleSave"> <i class="iconfont icon-moshubang"></i> 保存</span>
      <span @click="handleClear"> <i class="iconfont icon-shanchu"></i> 清空</span>
      <span class="float-r" @click="baseInfoShow = true">{{ data.case_title || '基础信息' }}</span>
    </header>

    <main class="integration-cases-add-main">
      <add-case-canvas :items="data.items" @update:item="updateItem"></add-case-canvas>
    </main>

    <!-- 设置基础信息 -->
    <el-drawer
      v-model="baseInfoShow"
      modal-class="base-info"
      title="设置基础信息"
      :before-close="handleBeforeClose"
      :with-header="true"
      direction="rtl"
    >
      <add-base-info :form="data" ref="refBaseInfo"></add-base-info>
    </el-drawer>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, unref } from 'vue'
import { useStore } from 'vuex'
import router from '../../router'
import emitter from 'lin/util/emitter'
import AddBaseInfo from './addBaseInfo.vue'

import AddCaseCanvas from './addCaseCanvas.vue'
import axios from '@/lin/plugin/axios'
import { ElMessage } from 'element-plus'
// 展示集成用例基础信息配置
let baseInfoShow = ref(false)

let timestamp = new Date().getTime()
let data = reactive({
  project_id: 1,
  edit_uid: useStore().getters.user.id,
  case_title: '', //`标题-${timestamp}`,
  case_desc: '',
  case_type: '正常',
  case_group_id: '',
  remark: '', //翻译用例分组

  items: [],
})

// 缓存的key
let locationKey = 'caseData'

onMounted(() => {
  let { id, remark: create_remark, group_id } = router.currentRoute.value.query || {}
  if (id) {
    locationKey = `caseData-${id}`
    data.id = id
  } else {
    // 创建时，直接显示基本信息
    baseInfoShow.value = true
    data.remark = create_remark
    data.case_group_id = Number(group_id)
  }
  let { case_title, case_desc, case_type, case_group_id, remark, items } =
    JSON.parse(window.localStorage.getItem(locationKey)) || {}
  if (case_title) {
    data.case_title = case_title
    data.case_desc = case_desc
    data.case_type = case_type
    data.case_group_id = case_group_id
    data.remark = remark
    data.items = items
  }
})

let updateItem = function ({ index, row }) {
  if (row) {
    data.items.splice(index + 1, 0, row)
  } else {
    data.items.splice(index, 1)
  }
  window.localStorage.setItem(locationKey, JSON.stringify(data))
}

// 校验基本信息
let refBaseInfo = ref('refBaseInfo')
let handleBeforeClose = async function (done) {
  await refBaseInfo.value.refForm.validate()
  window.localStorage.setItem(locationKey, JSON.stringify(data))
  done()
}

let handleSave = async function () {
  // 校验数据存在
  await refBaseInfo.value.refForm?.validate()

  let dataUnref = unref(data)
  let atom_case_list = dataUnref.items.map(v => v.id)
  let atom_case_detail = {}
  dataUnref.items.forEach((e, index) => {
    atom_case_detail[`${e.id}_${index}`] = {
      request_url: e.request_url,
      case_title: e.case_title,
      case_variable: e.case_variable,
      result_variable: e.result_variable,
    }
  })

  let params = {
    ...dataUnref,
    atom_case_list,
    atom_case_detail,
  }
  delete params.items

  let res = await axios({
    method: 'POST',
    url: `/iftest/case/scene/${params.id ? 'modify' : 'add'}`, //
    data: params,
  })

  ElMessage({
    type: res.code === 200 ? 'success' : 'error',
    message: res.message,
  })
  if (res.code === 200) {
    // 关闭当前tab
    window.localStorage.removeItem(locationKey)
    emitter.emit('custom-close')
    router.replace('/integrationcases/list')
  }
}

let handleClear = function () {
  data.items = []
}
</script>
<style lang="scss" scoped>
.integration-cases-add {
  height: 100%;
  overflow: hidden;

  &-header {
    background-color: #000;
    height: 50px;
    line-height: 50px;
    display: flex;
    padding: 0 10px;

    span {
      font-size: 14px;
      color: #ccc;
      cursor: pointer;
      user-select: none;

      &:hover,
      &:focus {
        color: #3c63cc;
      }
    }

    span:nth-of-type(2) {
      margin-left: auto;
    }

    span:nth-of-type(3) {
      margin-left: 10px;
    }

    span:nth-of-type(2),
    span:nth-of-type(3) {
      display: flex;
      flex-direction: column;
      line-height: 20px;
      justify-content: center;
      align-items: center;
    }

    .float-r {
      margin-left: auto;
    }
  }

  &-main {
    height: 100%;
    overflow-y: hidden;
    overflow-x: auto;
  }
}
</style>
<style lang="scss">
.base-info {
  position: absolute;
  top: 50px;
  height: calc(100% - 50px);
}
</style>
