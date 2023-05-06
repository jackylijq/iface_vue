<template>
    <div class="searchForm">
        <el-descriptions
            :column="2"
            :size="size"
            class="descriptBox"
            direction="horizontal"
            :style="blockMargin"
        >
            <el-descriptions-item label="计划名称" :span="1">{{ planData.plan_title }}</el-descriptions-item>
            <el-descriptions-item label="批次ID" :span="1">{{ planData.batch_id }}</el-descriptions-item>
            <!-- <el-descriptions-item label="计划描述" :span="2">{{ planData.exe_message }}</el-descriptions-item> -->
            <el-descriptions-item label="执行进度" :span="2">
              <!-- <span> -->
                <div style="padding-right:40px">{{ planData.pass_num+planData.failed_num}} / {{planData.pass_num+planData.failed_num+planData.un_run_num }}</div>
                <el-progress :percentage="Math.round((planData.pass_num+planData.failed_num)*100/(planData.pass_num+planData.failed_num+planData.un_run_num))" style="width:400px;" />
              <!-- </span> -->
            </el-descriptions-item>
            <el-descriptions-item label="执行状态" :span="2">
                <span class="stateSpan" v-for="(item,index) in stateList" :key="index" :style="{color:colorList[index]}">{{ item.label }}：{{ item.value }}</span> 
            </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="searchInput">
        <el-input
          v-model="searchData"
          @input="search"
          :placeholder="`请输入${select=='case_title'?'用例名称':'批次号'}`"
          class="input-with-select">
          <template #prepend>
            <el-select v-model="select" style="width: 110px">
              <!-- <el-option label="批次号" value="1" /> -->
              <el-option label="用例名称" value="case_title" />
            </el-select>
          </template>
        </el-input>
      </div>
      <div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            fixed
            type="index" :index="indexMethod"
            label="序号"
            width="80px">
          </el-table-column>
          <el-table-column
          :show-overflow-tooltip="true"
          fixed
            prop="id"
            label="用例编号"
            >
          </el-table-column>
          <el-table-column
            fixed
            prop="case_title"
            label="集成用例名称"
            :show-overflow-tooltip="true"
            >
          </el-table-column>
          <!-- <el-table-column
          :show-overflow-tooltip="true"
          fixed
            prop="name"
            label="用例类型"
            >
          </el-table-column> -->
          <el-table-column
            prop="exe_result"
            label="执行结果"
            :show-overflow-tooltip="true">
            <!-- <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.exe_result=="failed"?'失败':'成功' }}</span>
              </div>
            </template> -->
            <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px" :style="{color:resultType[scope.row.exe_result]?resultType[scope.row.exe_result].classType:''}">{{ resultType[scope.row.exe_result]?resultType[scope.row.exe_result].name:resultType.otherList.name }}</span>
          </div>
        </template>
          </el-table-column>
          <!-- <el-table-column
            prop="all_num"
            label="用例总数"
            :show-overflow-tooltip="true">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.pass_num+scope.row.failed_num+scope.row.un_run_num }}</span>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="pass_num"
            label="成功数量"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="failed_num"
            label="失败数量"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="un_run_num"
            label="未执行"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="exe_env"
            label="环境"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="edit_uid"
            label="执行人员"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="exe_time"
            label="执行时间">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template #default="scope">
              <el-button
                @click="openRow(scope)"
                type="text"
                size="small">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-model:currentPage="currentPage" v-bind="{ ...computedPageConfig}" @current-change="currentChange" @size-change="sizeChange"/>
    </div>
  </template>
  <script>
  import { ref, unref, computed, onMounted } from 'vue'
  import axios from '@/lin/plugin/axios'
  import { cloneDeep, throttle, debounce } from 'lodash'
  export default {
    props:['planData'],
    setup(props,context) {
      const tableData= ref([])
      // const boxData=props.planData
      const searchData= ref('')
      const select=ref('case_title')
      const colorList=ref(['#8af039','#d4001a',''])
      const resultType = ref({pass:{name:'执行成功',value:'pass',classType:'#8af039'},failed:{name:'执行失败',value:'failed',classType:'#d4001a'},otherList:{name:'未执行',value:'',classType:''}})
      // 获取表格数据
      const pageConfig = ref({
        curPage: 1,
        pageSize: 10,
        batch_id:props.planData.batch_id
      })
      const totalConfig = ref(0)
      const tableParams = ref({})
      const stateList = ref([{label:"成功",value:props.planData.pass_num?props.planData.pass_num:0},{label:"失败",value:props.planData.failed_num?props.planData.failed_num:0},{label:"未执行",value:props.planData.un_run_num?props.planData.un_run_num:0}])
      onMounted(() => {
        init();
      })
      const indexMethod = function (i) {
        return i+1+(pageConfig.value.curPage-1)*pageConfig.value.pageSize
      }
      const computedPageConfig = computed(() => ({
        currentPage: unref(pageConfig).curPage,
        pageSize: unref(pageConfig).pageSize,
        total: unref(totalConfig),
      }))
      //筛选
      const search = debounce(function (){
        tableParams.value={};
        if(searchData.value&&searchData.value.length>0){
          tableParams.value[select.value]=select.value=='batch_id'?Number(searchData.value):searchData.value;
        }
        init()
      },300)
      const currentChange = function (v) {
        pageConfig.value.curPage = v
        init()
      }
        
      const sizeChange = function (v) {
        pageConfig.value.pageSize = v
        init()
      }
      const init = async function () {
        const res = await axios({
          method: 'post',
          url: '/iftest/case/scene/result/list',
          data: {
            ...unref(tableParams),
            ...unref(pageConfig),
          },
        })

        const { datasList, curPage, pageSize, total } = res.data
        tableData.value = datasList
        pageConfig.value = {
          curPage,
          pageSize,
          batch_id:props.planData.batch_id
        }
        totalConfig.value = total
      }
      //展开
      //展开
      const openRow = function (data) {
            context.emit('changePage',data.row);
        }
      return {
        tableData,
        select,
        computedPageConfig,
        stateList,
        searchData,
        search,
        // boxData,
        indexMethod,
        openRow,
        sizeChange,
        currentChange,
        colorList,
        resultType
      }
    },
  }
  </script>
  <style lang="scss" scoped>
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
      .el-descriptions__content{
        display: inline-flex;
      }
    }
  }
  </style>
  