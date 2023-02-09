<template>
    <div class="searchForm">
        <el-descriptions
            :column="2"
            :size="size"
            title="基本信息"
            direction="horizontal"
            :style="blockMargin"
        >
            <el-descriptions-item label="用例名称" :span="1">{{ atomData.iface_name }}</el-descriptions-item>
            <el-descriptions-item label="接口地址" :span="2">{{ atomData.request_url }}</el-descriptions-item>
            <el-descriptions-item label="请求方式" :span="1">{{ atomData.request_method }}</el-descriptions-item>
            <el-descriptions-item label="执行结果" :span="1">{{ atomData.test_result=='pass'?'成功':'失败' }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions
            :column="1"
            :size="size"
            title="请求头"
            direction="horizontal"
            :style="blockMargin"
        >
        <el-descriptions-item :span="1">
            <el-input
                v-model="atomData.request_header"
                readonly=true
                :autosize="{ minRows: 8, maxRows: 12 }"
                type="textarea"/>
        </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
            :column="1"
            :size="size"
            title="请求参数"
            direction="horizontal"
            :style="blockMargin"
        >
        <el-descriptions-item :span="1">
            <el-input
                v-model="atomData.request_param"
                readonly=true
                :autosize="{ minRows: 8, maxRows: 12 }"
                type="textarea"/>
        </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
            :column="1"
            :size="size"
            title="响应数据"
            direction="horizontal"
            :style="blockMargin"
        >
        <el-descriptions-item :span="1">
            <el-input
                v-model="atomData.response"
                readonly=true
                :autosize="{ minRows: 8, maxRows: 12 }"
                type="textarea"/>
        </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
            :column="1"
            :size="size"
            title="数据检查"
            direction="horizontal"
            :style="blockMargin"
        >
        <el-descriptions-item :span="1">
            <el-input
                v-model="atomData.result_check_detail"
                readonly=true
                :autosize="{ minRows: 8, maxRows: 12 }"
                type="textarea"/>
        </el-descriptions-item>
        </el-descriptions>
    </div>
    <div>
       
    </div>
  </template>
  <script>
  import { ref, unref, computed, onMounted } from 'vue'
  import axios from '@/lin/plugin/axios'
  export default {
    props:['atomData'],
    setup(props) {
      
      return {
        
      }
    },
  }
  </script>
  <style lang="scss" scoped>
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
        .el-descriptions__header{
            border-left: 5px solid #3963bc;
            padding: 5px;
            margin-top:12px;
        }
    }
  }
  </style>
  