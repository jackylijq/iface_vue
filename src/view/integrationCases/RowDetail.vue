<template>
  <div class="rowDetail">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="用例参数" name="first">
        <el-form label-width="100px">
          <div class="formItem">
            <el-form-item label="接口地址">
              <el-input disabled v-model="form.request_url" />
            </el-form-item>
            <el-form-item label="接口标题">
              <el-input disabled v-model="form.case_title" />
            </el-form-item>
            <el-form-item label="接口描述">
              <el-input @blur="updateDetail('case_desc')" :disabled="props.canEdit" v-model="form.case_desc" />
            </el-form-item>
          </div>
          <el-form-item label="用例参数">
            <el-input type="textarea" v-model="form.case_variable" :disabled="props.canEdit" :rows="14"
              @blur="updateInfo('case_variable')"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="结果变量" name="second">
        <el-form label-width="80px">
          <div class="formItem">
            <el-form-item label="接口地址">
              <el-input disabled v-model="form.request_url" />
            </el-form-item>
            <el-form-item label="接口标题">
              <el-input disabled v-model="form.case_title" />
            </el-form-item>
            <el-form-item label="接口描述">
              <el-input @blur="updateDetail('case_desc')" :disabled="props.canEdit" v-model="form.case_desc" />
            </el-form-item>
          </div>
          <el-form-item label="结果变量">
            <el-input type="textarea" v-model="form.result_variable" :disabled="props.canEdit" :rows="14"
              @blur="updateInfo('result_variable')"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref, defineProps, onMounted, onUnmounted, reactive, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  msg: {
    type: Object,
  },
  canEdit: {
    type: Boolean
  }
})
const activeName = ref('first')

// 修改父组件中rowDetail信息
const emits = defineEmits(['updateDetail'])
// const updateDetail = () => {
//   emits('updateDetail', { form, id: props.msg.id })
// }
const updateDetail = key => {
  const dataString = form[key]
  emits('updateDetail', { key, data: dataString, tableId: props.msg.tableId })
}

const updateInfo = function (key) {
  const dataString = form[key]
  const strMap = {
    result_variable: '结果变量',
    case_variable: '用例参数'
  }
  try {
    emits('updateDetail', { key, data: JSON.parse(dataString), tableId: props.msg.tableId })
  } catch (error) {
    ElMessage.error(`${strMap[key]}不能被格式化`)
  }
}

// 展开框中内容
const form = reactive({
  case_title: '',
  request_url: '',
  id: '',
  tableId: '',
  case_desc: '',
  case_variable: '{}',
  result_variable: '{}'
})

onMounted(() => {
  getMsg()
})

const getMsg = function () {
  form.case_title = props.msg.case_title
  form.request_url = props.msg.request_url
  form.id = props.msg.id
  form.tableId = props.msg.tableId
  form.case_desc = props.msg.case_desc
  form.case_variable = JSON.stringify(props.msg.case_variable, null, 2)
  form.result_variable = JSON.stringify(props.msg.result_variable, null, 2)
}
</script>
<style lang="css" scoped>
.rowDetail {
  padding: 0px 25px;
  /* background-color: #f5f7fa; */
  border-bottom: 1px solid #dedfe0;
  height: 450px;
  overflow: auto;
  border-top: 1px solid #dedfe0;
}

.formItem {
  display: flex;
  justify-content: space-between;
}

.formItem * {
  width: 100%;
}

.el-form-item {
  margin-bottom: 0px !important;
}

::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
</style>
