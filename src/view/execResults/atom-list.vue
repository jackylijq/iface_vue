<template>
    <div class="searchForm">
        <el-descriptions
            :column="2"
            :size="size"
            class="descriptBox"
            direction="horizontal"
            :style="blockMargin"
        >
            <el-descriptions-item label="用例名称" :span="1">{{ caseData.case_title }}</el-descriptions-item>
            <el-descriptions-item label="执行状态" :span="2">
                <span class="stateSpan" v-for="(item,index) in stateList" :key="index">{{ item.label }}：{{ item.value }}</span> 
            </el-descriptions-item>
            <el-descriptions-item label="失败原因" :span="1">{{ caseData.exe_message }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="searchInput">
        <el-input
          v-model="input3"
          :placeholder="`请输入${select=='1'?'批次号':'计划名称'}`"
          class="input-with-select">
          <template #prepend>
            <el-select v-model="select" style="width: 110px">
              <el-option label="批次号" value="1" />
              <el-option label="计划名称" value="2" />
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
            fixed
            prop="iface_name"
            label="用例标题"
            :show-overflow-tooltip="true"
            >
          </el-table-column>
          <el-table-column
          :show-overflow-tooltip="true"
          fixed
            prop="name"
            label="用例类型"
            >
          </el-table-column>
          <el-table-column
            prop="test_result"
            label="执行结果"
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
            prop="message"
            label="失败原因">
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
  export default {
    props:['caseData'],
    setup(props,context) {
      const tableData= ref([])
      const select=ref('1')
      // 获取表格数据
      const pageConfig = ref({
        curPage: 1,
        pageSize: 10,
      })
      const totalConfig = ref(0)
      const tableParams = ref({case_id:props.caseData.id})
      const stateList = ref([{label:"成功",value:props.caseData.pass_num?props.caseData.pass_num:0},{label:"失败",value:props.caseData.failed_num?props.caseData.failed_num:0},{label:"未执行",value:props.caseData.un_run_num?props.caseData.un_run_num:0}])
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
          url: '/iftest/case/atom/result/list',
          data: {
            // ...unref(tableParams),
            ...unref(pageConfig),
          },
        })

        const { datasList, curPage, pageSize, total } = res.data
        tableData.value = datasList
        pageConfig.value = {
          curPage,
          pageSize,
        }
        totalConfig.value = total
      }
      //展开
      const openRow = function (data) {
        context.emit('changePage',data.row);
    }
      return {
        tableData,
        select,
        computedPageConfig,
        stateList,
        // boxData,
        indexMethod,
        openRow,
        sizeChange,
        currentChange,
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
    }
  }
  </style>
  