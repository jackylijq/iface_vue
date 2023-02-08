<template>
    <!-- <div class="searchForm">
        <el-descriptions
            :column="2"
            :size="size"
            class="descriptBox"
            direction="horizontal"
            :style="blockMargin"
        >
            <el-descriptions-item label="批次ID" :span="2">18100000000</el-descriptions-item>
            <el-descriptions-item label="执行进度" :span="2">Suzhou</el-descriptions-item>
            <el-descriptions-item label="执行状态" :span="2">
                <span class="stateSpan" v-for="(item,index) in stateList" :key="index">{{ item.label }}：{{ item.value }}</span> 
            </el-descriptions-item>
        </el-descriptions>
    </div> -->
    <div class="searchInput">
    <el-input
        v-model="searchData"
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
        prop="batch_id"
        label="批次ID"
        :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
        :show-overflow-tooltip="true"
        fixed
        prop="plan_title"
        label="计划名称"
        >
        </el-table-column>
        <el-table-column
        prop="exe_result"
        label="执行结果"
        :show-overflow-tooltip="true">
        </el-table-column>
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
            展开
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
    props: {
       
    },
    setup(props,context) {
        const tableData= ref([])
        const searchData= ref({batch_id:''})
        const select=ref('1')
        // 获取表格数据
        const pageConfig = ref({
            curPage: 1,
            pageSize: 10,
        })
        const totalConfig = ref(0)
        const tableParams = ref({})
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
            url: '/iftest/case/plan/result/list',
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
            searchData
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
            indexMethod,
            openRow,
            sizeChange,
            currentChange
        }
    },
  }
  </script>
  <style lang="scss" scoped>
  .results{
    padding:8px 12px;
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
  