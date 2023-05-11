<template>
  <div class="results">
    <el-page-header @back="onBack" v-if="pagePlan" class="headerBox">
        <template #content>
            <div class="flex items-center"> 
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>
                        <a @click="showChange(0)">汇总</a>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item v-if="pagePlan>0"> <a v-if="pagePlan>1" @click="showChange(1)">{{ planData.plan_title}}_{{ planData.batch_id }}</a><span v-if="pagePlan==1">{{ planData.plan_title}}_{{ planData.batch_id }}</span></el-breadcrumb-item>
                    <el-breadcrumb-item v-if="pagePlan>1"><a v-if="pagePlan>2" @click="showChange(2)">{{ caseData.case_title}}_{{ caseData.batch_id }}</a><span v-if="pagePlan==2">{{ caseData.case_title}}_{{ caseData.batch_id }}</span></el-breadcrumb-item>
                    <el-breadcrumb-item v-if="pagePlan>2"><span>{{ atomData.iface_name}}_{{ atomData.batch_id }}</span></el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </template>
    </el-page-header>
    <div v-if="!pagePlan">
      <test-plan-list @changePage="changePage"></test-plan-list>
    </div>
    <div v-else-if="pagePlan==1">
      <integration-list :planData="planData" @changePage="changePage"></integration-list>
    </div>
    <div v-else-if="pagePlan==2">
      <atom-list :caseData="caseData" :planData="planData" @changePage="changePage"></atom-list>
    </div>
    <div v-else-if="pagePlan==3">
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
/**
 * testPlan/integration/atom/detail
*/
export default {
  components: { testPlanList, integrationList,atomList,detailPage},
  setup() {
    let pagePlan=ref(0)
    let planData=ref({})
    let caseData=ref({})
    let atomData=ref({})
    const changePage = function (data) {
      pagePlan.value = pagePlan.value + 1;
      switch (pagePlan.value){
        case 1:planData.value=data; break;
        case 2:caseData.value=data; break;
        case 3:atomData.value=data;
        atomData.value.request_header=JSON.stringify(atomData.value.request_header, null, '\t')
        atomData.value.request_param=JSON.stringify(atomData.value.request_param, null, '\t')
        atomData.value.response=JSON.stringify(atomData.value.response, null, '\t')
        atomData.value.result_check_detail=JSON.stringify(atomData.value.result_check_detail, null, '\t')
         break;
        default: return '';
      }
    }
    const showChange = function(index){
      pagePlan.value=index;
    }
    const onBack = function(data){
      pagePlan.value--;
    }
    return {
      changePage,
      pagePlan,
      planData,
      caseData,
      atomData,
      onBack,
      showChange
    }
  },
}
</script>
<style lang="scss" scoped>
.results{
  padding:8px 12px;
  ::v-deep{
      .el-breadcrumb{
          line-height:24px;
      }
      .el-page-header{
          margin:0px 0px 8px 0px;
      }
  }
  // .headerBox{
  //   border-bottom:1px solid var(--el-border-color);
  //   border-top:1px solid var(--el-border-color);
  // }
}
  .stateSpan{
    margin:0px 40px 0px 0px;
  }
  .descriptBox{
    border: 1px solid var(--el-border-color);
  }
  .searchInput{
    width: 350px;
    float: right;
    margin:8px 0px;
  }
  .searchForm{
    ::v-deep{
      .el-form-item__content{
        margin-bottom: 0px;
      }
      .el-form-item{
        margin-bottom: 5px !important;
      }
      .el-descriptions__body{
        padding:8px;
      }
    }
  }
</style>
