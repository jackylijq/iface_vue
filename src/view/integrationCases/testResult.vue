<!-- 测试结果 -->
<template>
  <div style="padding: 8px 12px">
    <el-page-header v-if="caseId" @back="onBack">
      <template #content>
        <el-breadcrumb style="line-height: 24px">
          <el-breadcrumb-item>
            <a @click="onBack">测试结果</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <a>结果详情</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </template>
    </el-page-header>

    <test-result-list v-if="!caseId"></test-result-list>
    <test-result-single v-else ></test-result-single>
  </div>
</template>
<script setup>
import { onMounted, ref, watchEffect } from 'vue'
import router from '../../router'
import emitter from 'lin/util/emitter'
import TestResultList from './testResultList.vue'
import TestResultSingle from './testResultSingle.vue'

let caseId = ref(undefined)
watchEffect(() => {
  caseId.value = router.currentRoute.value.query.case_id
})

let onBack = function () {
  router.replace({
    path: '/integrationcases/test',
    query: {
      ...router.currentRoute.value.query,
      case_id: undefined,
    },
  })
  emitter.emit('custom-close')
}
</script>
<style lang="scss" scoped></style>
