<template>
  <div class="tableHeader" v-if="!seeDetail">
    <div class="tableSetting">
      <el-tooltip effect="dark" content="添加用例" placement="top">
        <img src="../../assets/image/icon/add.svg" @click="addCasesShow = true" alt="" />
      </el-tooltip>
      <el-tooltip effect="dark" content="导入计划" placement="top">
        <img src="../../assets/image/icon/import.svg" @click="addPlanShow = true" style="width: 28px" alt="" />
      </el-tooltip>
      <el-tooltip effect="dark" content="保存计划" placement="top">
        <img src="../../assets/image/icon/save.svg" @click="submit" style="width: 22px" alt="" />
      </el-tooltip>
    </div>
  </div>
  <div class="test-plans-create">
    <el-form ref="refForm" :rules="rules" :model="form" label-width="100px" :disabled="seeDetail">
      <el-form-item prop="plan_title" label="计划标题">
        <el-input v-model="form.plan_title" autocomplete="off" placeholder="请输入计划标题" style="width: 200px" />
      </el-form-item>
      <el-form-item label="计划分组">
        <el-tree-select
          v-model="form.group_id"
          check-strictly
          :props="{ label: 'group_name' }"
          node-key="id"
          :data="groupList"
          style="width: 200px"
        ></el-tree-select>
      </el-form-item>
      <el-form-item prop="plan_desc" label="计划描述">
        <el-input
          v-model="form.plan_desc"
          placeholder="计划描述"
          autocomplete="off"
          style="width: 200px"
          maxlength="200"
        />
      </el-form-item>
    </el-form>

    <section style="margin-bottom: 3px" v-if="false">
      <el-button type="primary" @click="addCasesShow = true">添加用例</el-button>
      <el-button type="primary" @click="submit">保存计划</el-button>
    </section>

    <el-table :data="form.tableData" stripe style="width: 100%">
      <el-table-column :show-overflow-tooltip="false" prop="id" label="集成id" width="100px" />
      <el-table-column :show-overflow-tooltip="true" prop="case_title" label="集成用例名称" min-width="150px">
        <template #default="{row}">
          <a style="color: #3963bc" @click="handleRowClick(row)">{{ row && row.case_title }}</a>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="case_desc" label="集成用例描述" min-width="250px" />
      <el-table-column :show-overflow-tooltip="true" prop="atom_case_num" label="原子用例数量" min-width="150px" />
      <el-table-column :show-overflow-tooltip="true" prop="case_type" label="用例状态" min-width="100px" />
      <el-table-column :show-overflow-tooltip="true" prop="edit_uid" label="更新人员" min-width="100px" />
      <el-table-column :show-overflow-tooltip="true" prop="update_time" label="更新时间" min-width="150px" />
      <el-table-column label="操作" width="200px" v-if="!seeDetail">
        <template #default="scope">
          <!-- 上移动 -->
          <svg
            v-if="scope.$index > 0"
            t="1676445827069"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4052"
            width="16"
            height="16"
            @click="handleMoveUp(scope)"
          >
            <path
              d="M554.666667 268.8v601.6h-85.333334V268.8L337.066667 401.066667 277.333333 341.333333 512 106.666667 746.666667 341.333333l-59.733334 59.733334L554.666667 268.8z"
              fill="#515151"
              p-id="4053"
            ></path>
          </svg>

          <!-- 下移 -->
          <svg
            v-if="scope.$index < form.tableData.length - 1"
            t="1676445887024"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4351"
            width="16"
            height="16"
            @click="handleMoveDown(scope)"
          >
            <path
              d="M554.666667 712.533333V106.666667h-85.333334v601.6l-132.266666-132.266667L277.333333 640l234.666667 234.666667 234.666667-234.666667-59.733334-59.733333-132.266666 132.266666z"
              fill="#515151"
              p-id="4352"
            ></path>
          </svg>

          <!-- 删除 -->
          <svg
            t="1676445930223"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5460"
            width="16"
            height="16"
            @click="handleDelete(scope)"
          >
            <path
              d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z"
              fill="#515151"
              p-id="5461"
            ></path>
          </svg>
        </template>
      </el-table-column>
    </el-table>

    <dialog-add-cases
      :value="addCasesShow"
      @input="
        val => {
          addCasesShow = val
        }
      "
      @save="handleSave"
      :selectedData="form.tableData"
    ></dialog-add-cases>
    <dialog-add-plan
      :value="addPlanShow"
      @input="
        val => {
          addPlanShow = val
        }
      "
      @save="handleImport"
    ></dialog-add-plan>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, onActivated, computed } from 'vue'
import axios from '@/lin/plugin/axios'
import store from '../../store'
import DialogAddCases from './dialogAddCases.vue'
import dialogAddPlan from './dialogAddPlan.vue'
import { ElMessage } from 'element-plus'
import router from '../../router'
import emitter from 'lin/util/emitter'
let rules = reactive({
  plan_title: [{ required: true, message: '测试集标题不能为空', trigger: 'change' }],
})
let form = reactive({
  group_id: '',
  plan_title: '',
  plan_desc: '',
  tableData: [],
})

let isEdit = computed(() => {
  return router.currentRoute.value.path === '/testplans/edit'
})

//判断是详情还是编辑
const seeDetail = computed(() => (router.currentRoute.value.query.detail === 'true' ? true : false))

// 导入计划
const addPlanShow = ref(false)

const transferTreeData = function (arr, initValue, id = 'id', pId = 'pId') {
  let res = []
  if (arr.length === 0) return res
  for (let item of arr) {
    if (item && item[pId] === initValue) {
      let children = transferTreeData(arr, item[id], id, pId)
      item.children = children
      res.push(item)
    }
  }
  return res
}
let groupList = ref([])
let getGroupList = async () => {
  let res = await axios({
    method: 'POST',
    url: '/iftest/condition/group/list',
    data: { project_line_id: 1, group_type: 'scene' },
  })

  groupList.value = transferTreeData(res.data.datasList, 0, 'id', 'parents_id')

  form.group_id = groupList.value[0].id
}

// 查看集成用例详情
const handleRowClick = row => {
  let { atom_case_list, atom_case_detail, id, case_desc, case_group_id, remark, case_title, case_type, project_id } =
    row
  let caseData = {
    id,
    project_id,
    case_desc,
    case_group_id,
    remark,
    case_title,
    case_type,
  }
  if (typeof atom_case_detail === 'string') {
    atom_case_detail = JSON.parse(atom_case_detail)
  }
  caseData.items = (typeof atom_case_list === 'number' ? [atom_case_list] : atom_case_list.split(','))
    .map((v, i) => `${v}_${i}`)
    .map(v => {
      return {
        ...atom_case_detail[v],
        id: v.slice(0, v.lastIndexOf('_')),
      }
    })
  window.localStorage.setItem(`caseData-${row.id}`, JSON.stringify(caseData))
  router.push({ path: '/integrationcases/detail', query: { id: row.id, noEdit: true } })
}

onActivated(async () => {
  getGroupList()

  if (isEdit.value) {
    let { id, plan_title, plan_desc, group_id, scene_case_list } =
      JSON.parse(window.localStorage.getItem('test-plan-edit')) || {}
    // id存在就是编辑计划
    if (id) {
      form.id = id
      form.plan_title = plan_title
      form.plan_desc = plan_desc
      form.group_id = group_id
    }
    typeof scene_case_list === 'number' && (scene_case_list = String(scene_case_list))
    let res = await axios({
      method: 'POST',
      url: '/iftest/case/scene/list',
      data: {
        id: scene_case_list.split(','),
        curPage: 1,
        pageSize: scene_case_list.split(',').length,
      },
    })
    if (scene_case_list.length) {
      form.tableData = scene_case_list.split(',').map(v => {
        return res.data.datasList.find(e => v == e.id)
      }).filter(v=>!!v)
    }
  }
})

let handleMoveUp = ({ row, $index }) => {
  let goal = form.tableData.splice($index, 1)
  form.tableData.splice($index - 1, 0, goal[0])
}

let handleMoveDown = ({ row, $index }) => {
  let goal = form.tableData.splice($index, 1)
  form.tableData.splice($index + 1, 0, goal[0])
}

let handleDelete = ({ $index }) => {
  form.tableData.splice($index, 1)
}

let addCasesShow = ref(false)
let handleSave = ({ selections }) => {
  form.tableData = [...selections]
}

const handleImport = datasList => {
  console.log(form.tableData)
  const differentObjects = datasList.filter(obj1 => !form.tableData.some(obj2 => obj1.id === obj2?.id))
  form.tableData.push(...differentObjects)
}

let refForm = ref()
let submit = async () => {
  await refForm.value.validate()

  let { group_id, plan_desc, plan_title, tableData, id } = form
  let data = {
    project_line_id: 1,
    group_id,
    id,
    edit_uid: window.sessionStorage.getItem('userName'),
    plan_title,
    plan_desc,
    scene_case_list: tableData.map(v => v.id),
  }

  let url = form.id ? '/iftest/case/plan/modify' : '/iftest/case/plan/add'

  let res = await axios({
    method: 'POST',
    url,
    data,
  })

  ElMessage({
    type: res.code === 200 ? 'success' : 'error',
    message: res.message,
  })
  if (res.code === 200) {
    emitter.emit('custom-close')
    if (isEdit.value) window.localStorage.removeItem('test-plan-edit')
    router.push('/testplans/list')
  }
}
</script>
<style lang="scss" scoped>
.test-plans-create {
  padding: 10px;

  .icon {
    cursor: pointer;

    &:nth-of-type(n + 2) {
      margin-left: 10px;
    }

    :hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 1;
    }
  }
}
.el-form {
  display: flex;
  :deep(.el-form-item) {
    width: calc(100% / 3);
    margin-bottom: 10px !important;
  }
  :deep(.el-form-item__content) {
    margin-bottom: 0px !important;
  }
}
.tableHeader {
  width: 100%;
  height: 47px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  font-weight: 700;
  right: 0;
  .tableSetting {
    display: flex;
  }
  img {
    margin-right: 10px;
    width: 18px;
  }
  *:hover {
    cursor: pointer;
  }
}
</style>
