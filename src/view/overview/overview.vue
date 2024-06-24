<template>
  <div class="overview">
    <overview-reload :time="reloadTime" @refresh="reloadData" />
    <overview-item title="总体统计" :content-schema="computedStaticAll"></overview-item>
    <overview-item title="最近一周更新统计" :content-schema="computedLastWeekStatic"></overview-item>

    <overview-item v-if="proStatic.length > 0" title="产品接口实现汇总" :content-schema="proStatic" style="width: 100%">
      <template v-slot="{ componentData }">
        <overview-item-pie v-bind="componentData"></overview-item-pie>
      </template>
    </overview-item>

    <overview-item
      v-if="openApiData.length > 0"
      title="openAPI实现汇总"
      :content-schema="openApiData"
      style="width: 100%"
    >
      <template v-slot="{ componentData }">
        <overview-item-pie v-bind="componentData"></overview-item-pie>
      </template>
    </overview-item>
  </div>
</template>
<script setup>
import { computed, ref, unref } from 'vue'
import axios from 'lin/plugin/axios'
import overviewReload from './overviewReload.vue'
import overviewItem from './overviewItem.vue'
import overviewItemPie from './overviewItemPie.vue'
import { ElMessage } from 'element-plus'
let staticAll = [
  { title: '平台接口总数', prop: 'iface_num', value: 0 },
  { title: '用例覆盖接口', prop: 'iface_cover_num', value: 0 },
  { title: '原子用例数量', prop: 'atom_num', value: 0 },
  { title: '场景用例数量', prop: 'scene_num', value: 0 },
  { title: '测试计划数量', prop: 'plan_num', value: 0 },
]
let staticData = ref({})

let lastWeekStatic = [
  { prop: 'iface_num', title: '接口数量', value: 0 },
  { prop: 'atom_num', title: '原子用例数量', value: 0 },
  { prop: 'scene_num', title: '场景用例数量', value: 0 },
  // { prop: 'plan_num', title: '测试计划数量', value: 0 },
  // { prop: '', title: '待更新用例', value: 0 },
]

let lastWeekData = ref({})

let proStatic = ref([])
let openApiData = ref([])

let reloadTime = ref('')

function getData() {
  axios({
    method: 'POST',
    url: '/iftest/statistics/summaryAll',
    data: {},
  }).then(res => {
    staticData.value = res.data.datasList
  })

  axios({
    method: 'POST',
    data: {},
    url: '/iftest/statistics/summarySeven',
  }).then(res => {
    lastWeekData.value = res.data.datasList
  })

  axios({
    method: 'POST',
    data: {},
    url: '/iftest/statistics/summaryPro',
  }).then(res => {
    reloadTime.value = res.data.datasList[0]?.update_time
    proStatic.value = res.data.datasList.map(v => ({
      title: v.pro_name,
      total: v.iface_num,
      finish: v.iface_cover_num,
      unrealized_num: v.unrealized_num || 0,
      mesi_num: v.mesi_num || 0,
      pro_id: v.pro_id,
    }))
  })

  axios({
    method: 'POST',
    url: '/iftest/statistics/summaryOpenapi',
    data: {},
  }).then(res => {
    openApiData.value = res.data.datasList.map(v => ({
      title: v.pro_name,
      total: v.iface_num,
      finish: v.iface_cover_num,
      unrealized_num: v.unrealized_num || 0,
      mesi_num: v.mesi_num || 0,
      pro_id: v.pro_id,
    }))
  })
}
getData()
function reloadData() {
  axios({
    method: 'POST',
    url: '/iftest/statistics/summaryUpdate',
    data: {},
  }).then(res => {
    ElMessage({
      type: res.code === 200 ? 'success' : 'error',
      message: res.message,
    })
  })
}

let computedStaticAll = computed(() => {
  return staticAll.map(v => {
    v.value = unref(staticData)[v.prop] || 0
    return v
  })
})

let computedLastWeekStatic = computed(() => {
  return lastWeekStatic.map(v => {
    v.value = unref(lastWeekData)[v.prop] || 0
    return v
  })
})
</script>
<style lang="scss" scoped>
.overview {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin-right: 20px;
}
</style>
