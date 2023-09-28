<template>
  <div class="results">
    <el-page-header @back="onBack" v-if="pagePlan" class="headerBox">
      <template #content>
        <div class="flex items-center">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <a @click="showChange(0)">汇总</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="pagePlan > 0">
              <a v-if="pagePlan > 1" @click="showChange(1)">{{ planData.plan_title }}_{{ planData.batch_id }}</a
              ><span v-if="pagePlan == 1">{{ planData.plan_title }}_{{ planData.batch_id }}</span></el-breadcrumb-item
            >
            <el-breadcrumb-item v-if="pagePlan > 1"
              ><a v-if="pagePlan > 2" @click="showChange(2)">{{ caseData.case_title }}_{{ caseData.batch_id }}</a
              ><span v-if="pagePlan == 2">{{ caseData.case_title }}_{{ caseData.batch_id }}</span></el-breadcrumb-item
            >
            <el-breadcrumb-item v-if="pagePlan > 2"
              ><span>{{ atomData.case_title }}_{{ atomData.batch_id }}</span></el-breadcrumb-item
            >
          </el-breadcrumb>
        </div>
      </template>
    </el-page-header>
    <div v-if="pagePlan == 0">
      <test-plan-list @changePage="changePage"></test-plan-list>
    </div>
    <div v-else-if="pagePlan == 1">
      <integration-list :planData="planData" @changePage="changePage" @refresh="handleRefresh"></integration-list>
    </div>
    <div v-else-if="pagePlan == 2">
      <atom-list
        :caseData="caseData"
        :planData="planData"
        @changePage="changePage"
        @refresh="handleRefresh_2"
      ></atom-list>
    </div>
    <div v-else-if="pagePlan == 3">
      <detail-page :atomData="atomData" @changePage="changePage"></detail-page>
    </div>
  </div>
</template>
<script>
import { ref, unref, computed, onMounted } from 'vue'
import axios from '@/lin/plugin/axios'
import testPlanList from './test-plan-list.vue'
import integrationList from './integration-list.vue'
import atomList from './atom-list.vue'
import detailPage from './detail-page.vue'
import router from '@/router'
import emitter from 'lin/util/emitter'
/**
 * testPlan/integration/atom/detail
 */
export default {
  components: { testPlanList, integrationList, atomList, detailPage },
  setup() {
    let pagePlan = ref(-1)
    let planData = ref({})
    let caseData = ref({})
    let atomData = ref({})
    const changePage = function (data) {
      emitter.emit('custom-close')

      let pagePlan1 = pagePlan.value + 1
      // pagePlan.value = pagePlan1
      switch (pagePlan1) {
        case 1:
          planData.value = data
          router.push({
            path: '/execresults/list',
            query: {
              batch_id: data.batch_id,
            },
          })
          break
        case 2:
          caseData.value = data
          router.push({
            path: '/execresults/list',
            query: {
              batch_id: data.batch_id,
              scene_id: data.scene_id,
            },
          })
          break
        case 3:
          atomData.value = data
          atomData.value.request_header = JSON.stringify(atomData.value.request_header, null, '\t')
          atomData.value.request_param = JSON.stringify(atomData.value.request_param, null, '\t')
          atomData.value.response = JSON.stringify(atomData.value.response, null, '\t')
          atomData.value.result_check_detail = JSON.stringify(atomData.value.result_check_detail, null, '\t')
          router.push({
            path: '/execresults/list',
            query: {
              batch_id: data.batch_id,
              scene_id: data.scene_id,
              case_id: data.case_id,
              id: data.id,
            },
          })
          break
        default:
          return ''
      }
    }

    // 处理PagePlan
    let setPagePlan = async function () {
      let { batch_id, scene_id, case_id, id } = router.currentRoute.value.query

      let length = [batch_id, scene_id, case_id].filter(v => v > -1).length

      if (case_id) {
        const res = await axios({
          method: 'post',
          url: '/iftest/case/atom/result/list',
          data: {
            batch_id,
            scene_id,
            case_id,
            id,
            curPage: 1,
            pageSize: 10,
          },
        })
        atomData.value = res.data.datasList[0]
        atomData.value.request_header = JSON.stringify(atomData.value.request_header, null, '\t')
        atomData.value.request_param = JSON.stringify(atomData.value.request_param, null, '\t')
        atomData.value.response = JSON.stringify(atomData.value.response, null, '\t')
        atomData.value.result_check_detail = JSON.stringify(atomData.value.result_check_detail, null, '\t')
      }

      if (scene_id) {
        const res = await axios({
          method: 'post',
          url: '/iftest/case/scene/result/list',
          data: {
            batch_id,
            scene_id,
            curPage: 1,
            pageSize: 10,
          },
        })
        caseData.value = res.data.datasList[0]
      }
      if (batch_id) {
        // 获取详情
        const res = await axios({
          method: 'post',
          url: '/iftest/case/plan/result/list',
          data: {
            batch_id,
            curPage: 1,
            pageSize: 10,
          },
        })
        planData.value = res.data.datasList[0] || {}
      }

      pagePlan.value = length
    }
    setPagePlan()

    const showChange = function (index) {
      var { batch_id, scene_id } = router.currentRoute.value.query
      emitter.emit('custom-close')
      setTimeout(() => {
        switch (index) {
          case 0:
            router.push('/execresults/list')
            break
          case 1:
            router.push({
              path: '/execresults/list',
              query: {
                batch_id,
              },
            })
            break
          case 2:
            router.push({
              path: '/execresults/list',
              query: {
                batch_id,
                scene_id,
              },
            })
            break
        }
      }, 0)
    }
    const onBack = function (data) {
      // emitter.emit('custom-close')
      // pagePlan
      // router.go(-1)
      let plan = pagePlan.value
      showChange(--plan)
    }

    let handleRefresh = function () {
      setPagePlan()
    }

    let handleRefresh_2 = async function () {
      let { batch_id, scene_id } = router.currentRoute.value.query
      if (scene_id) {
        const res = await axios({
          method: 'post',
          url: '/iftest/case/scene/result/list',
          data: {
            batch_id,
            scene_id,
            curPage: 1,
            pageSize: 10,
          },
        })
        caseData.value = res.data.datasList[0] || {}
      }
    }
    return {
      changePage,
      pagePlan,
      planData,
      caseData,
      atomData,
      onBack,
      showChange,
      handleRefresh,
      handleRefresh_2,
    }
  },
}
</script>
<style lang="scss" scoped>
.results {
  padding: 8px 12px;
  ::v-deep {
    .el-breadcrumb {
      line-height: 24px;
    }
    .el-page-header {
      margin: 0px 0px 8px 0px;
    }
  }
  // .headerBox{
  //   border-bottom:1px solid var(--el-border-color);
  //   border-top:1px solid var(--el-border-color);
  // }
}
.stateSpan {
  margin: 0px 40px 0px 0px;
}
.descriptBox {
  border: 1px solid var(--el-border-color);
}
.searchInput {
  width: 350px;
  float: right;
  margin: 8px 0px;
}
.searchForm {
  ::v-deep {
    .el-form-item__content {
      margin-bottom: 0px;
    }
    .el-form-item {
      margin-bottom: 5px !important;
    }
    .el-descriptions__body {
      padding: 8px;
    }
  }
}
</style>
