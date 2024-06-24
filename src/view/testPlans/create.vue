<template>
  <div class="tableHeader" v-if="!seeDetail">
    <div class="tableSetting">
      <el-tooltip effect="dark" content="添加用例" placement="top">
        <svg
          @click="addCasesShow = true"
          style="margin: 0 5px"
          class="icon"
          width="18"
          height="28"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M512 57.677643C261.084506 57.677643 57.677643 261.084506 57.677643 512s203.406863 454.322357 454.322357 454.322357 454.322357-203.406863 454.322357-454.322357S762.915494 57.677643 512 57.677643z"
            fill="#666666"
          />
          <path
            d="M444.236756 461.703321c1.169525-126.269671 9.428964-220.357879 67.759695-220.357879 58.338718 0 66.599931 94.088208 67.769455 220.357879 124.793123 1.218329 217.429629 9.431626 217.42963 64.839431 0 55.400707-92.636506 63.614003-217.42963 64.831446-1.169525 126.274995-9.429851 220.358766-67.769455 220.358766-58.331619 0-66.591057-94.083771-67.759695-220.358766-124.798447-1.217442-217.429629-9.430738-217.429629-64.831446 0-55.407806 92.630295-63.621102 217.429629-64.839431z"
            fill="#FFFFFF"
          />
        </svg>
      </el-tooltip>
      <el-tooltip effect="dark" content="导入计划" placement="top">
        <svg
          @click="addPlanShow = true"
          style="margin: 0 5px"
          class="icon"
          width="18"
          height="28"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M510.495057 625.379161c-212.404575 0-384.594523 43.293726-384.594523 96.69435s172.189948 96.69435 384.594523 96.69435c212.413449 0 384.603397-43.293726 384.603397-96.69435s-172.189948-96.69435-384.603397-96.69435z"
            fill="#666666"
            opacity=".7"
          />
          <path
            d="M513.496957 772.937206c-212.404575 0-384.594523 43.293726-384.594524 96.69435s172.189948 96.69435 384.594524 96.69435c212.413449 0 384.603397-43.293726 384.603397-96.69435s-172.189948-96.69435-384.603397-96.69435z"
            fill="#666666"
            opacity=".7"
          />
          <path
            d="M618.71695 433.256707c49.586801-49.587688 79.021033-100.554315 65.737428-113.83792-13.283605-13.283605-64.250232 16.150627-113.83792 65.737428a494.475757 494.475757 0 0 0-4.560084 4.62131c2.942447-22.003577 4.569844-46.168735 4.569844-71.524714 0-91.955023-21.382433-168.236811-49.389809-182.579022-26.749116-20.460478-85.436562-34.664263-153.536998-34.664264-93.313553 0-168.96 26.664818-168.96 59.567695s75.646447 59.576568 168.96 59.576569c35.771674 0 68.946967-3.919418 96.259549-10.606475-7.072166 30.516797-11.244478 68.081802-11.244478 108.705497 0 27.143986 1.863432 52.921456 5.208735 76.14425a476.662239 476.662239 0 0 0-8.997713-9.242621c-49.586801-49.586801-100.554315-79.021033-113.83792-65.737428-13.283605 13.283605 16.150627 64.25112 65.738315 113.83792 41.478211 41.479099 83.919196 68.85557 104.468409 68.93277 2.094142 0.706329 4.221116 1.068367 6.375598 1.068367 2.608804 0 5.179452-0.531522 7.699522-1.563507 21.952998-3.875938 61.059328-30.14766 99.347522-68.435855z"
            fill="#666666"
          />
        </svg>
      </el-tooltip>
      <el-tooltip effect="dark" content="保存计划" placement="top">
        <svg
          @click="submit"
          style="margin: 0 5px"
          width="18"
          height="28"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#666666"
            d="M971.95 152.88c0-55.14-44.86-99.99-100-99.99H797v230c0 38.6-30.59 70-68.18 70H295.18c-37.6 0-68.18-31.4-68.18-70v-230h-75c-26.62 0-51.71 10.43-70.64 29.36C62.42 101.18 52 126.27 52 152.9l0.05 720c0 55.14 44.86 99.99 100 99.99H872c26.62 0 51.71-10.43 70.64-29.36C961.58 924.6 972 899.51 972 872.88l-0.05-720z"
          />
          <path
            fill="#666666"
            d="M295.18 312.89h433.64c15.54 0 28.18-13.46 28.18-30v-230H267v230c0 16.54 12.64 30 28.18 30z m325.1-160.3c0-11.05 8.95-20 20-20s20 8.95 20 20v60c0 11.05-8.95 20-20 20s-20-8.95-20-20v-60z"
          />
        </svg>
      </el-tooltip>

      <el-tooltip effect="dark" content="批量删除" placement="top">
        <svg
          @click="batchDelete"
          style="margin: 0 5px"
          width="18"
          height="28"
          viewBox="0 0 1025 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#666666"
            d="M962.56 184.768H61.44c-33.792 0-61.44 27.648-61.44 61.44 0 33.792 27.648 61.44 61.44 61.44h81.92v597.056c0 42.24 34.56 76.8 76.8 76.8h583.68c42.24 0 76.8-34.56 76.8-76.8V307.648h81.92c33.792 0 61.44-27.648 61.44-61.44 0-33.792-27.648-61.44-61.44-61.44zM364.288 834.752c0 21.376-17.408 38.784-38.784 38.784-21.312 0-38.784-17.408-38.784-38.784V446.72c0-21.376 17.472-38.784 38.784-38.784 10.688 0 20.352 4.352 27.392 11.392a38.4896 38.4896 0 0 1 11.392 27.392v388.032z m186.496 0c0 21.376-17.472 38.784-38.784 38.784-21.312 0-38.784-17.408-38.784-38.784V446.72c0-21.376 17.472-38.784 38.784-38.784 10.624 0 20.352 4.352 27.392 11.392a38.4896 38.4896 0 0 1 11.392 27.392v388.032z m186.496 0c0 21.376-17.472 38.784-38.784 38.784-21.376 0-38.784-17.408-38.784-38.784V446.72c0-21.376 17.408-38.784 38.784-38.784 10.624 0 20.352 4.352 27.392 11.392a38.4896 38.4896 0 0 1 11.392 27.392v388.032zM433.536 136.256h156.928c25.792 0 46.912-21.12 46.912-46.912s-21.12-46.912-46.912-46.912H433.536c-25.792 0-46.912 21.12-46.912 46.912s21.184 46.912 46.912 46.912z"
          />
        </svg>
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

    <el-table
      ref="tableRef"
      :key="refreshKey"
      :data="form.tableData"
      stripe
      style="width: 100%"
      row-key="id"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="false" prop="id" label="集成id" width="100px">
        <template #default="{ row }">
          <span class="integration_id">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="case_title" label="集成用例名称1" min-width="150px">
        <template #default="{ row }">
          <a style="color: #3963bc" @click="handleRowClick(row)">{{ row && row.case_title }}</a>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="case_desc" label="集成用例描述" min-width="250px" />
      <el-table-column :show-overflow-tooltip="true" prop="atom_case_num" label="原子用例数量" min-width="150px" />
      <el-table-column :show-overflow-tooltip="true" prop="case_type" label="用例状态" min-width="100px" />
      <el-table-column :show-overflow-tooltip="true" prop="edit_uid" label="更新人员" min-width="100px" />
      <el-table-column :show-overflow-tooltip="true" prop="update_time" label="更新时间" min-width="150px" />
      <el-table-column label="操作" width="100px" v-if="!seeDetail">
        <template #default="scope">
          <!-- 上移动 -->
          <!-- <svg
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
          </svg> -->

          <!-- 下移 -->
          <!-- <svg
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
          </svg> -->

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
import { ref, reactive, onMounted, onActivated, computed, unref, nextTick } from 'vue'
import axios from '@/lin/plugin/axios'
import store from '../../store'
import DialogAddCases from './dialogAddCases.vue'
import dialogAddPlan from './dialogAddPlan.vue'
import { ElMessage } from 'element-plus'
import router from '../../router'
import emitter from 'lin/util/emitter'
import { createSortable } from './sortJs'

let refreshKey = ref(1)
let tableRef = ref()
onMounted(() => {
  createSortable(tableRef.value.$el.querySelector('.el-table__body-wrapper .el-table__body tbody'))
})

let multipleSelection = ref([])
function tableRowClassName({ row, rowIndex }) {
  return multipleSelection.value.some(v => v.id === row.id) ? 'selected' : ''
}
function handleSelectionChange(val) {
  multipleSelection.value = val
}

function batchDelete() {
  form.tableData = form.tableData.filter(v => !unref(multipleSelection).some(e => e.id === v.id))
  multipleSelection.value = []
}

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
    data: { pro_line_id: 1, group_type: 'scene' },
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
        // id: scene_case_list.split(','),
        id: typeof scene_case_list === 'string' ? scene_case_list.split(',') : scene_case_list,
        curPage: 1,
        // pageSize: scene_case_list.split(',').length,
        pageSize: (typeof scene_case_list === 'string' ? scene_case_list.split(',') : scene_case_list).length,
      },
    })
    if (scene_case_list.length) {
      // form.tableData = scene_case_list.split(',').map(v => {
      form.tableData = (typeof scene_case_list === 'string' ? scene_case_list.split(',') : scene_case_list)
        .map(v => {
          return res.data.datasList.find(e => v == e.id)
        })
        .filter(v => !!v)
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
  const differentObjects = datasList.filter(obj1 => !form.tableData.some(obj2 => obj1.id === obj2?.id))
  form.tableData.push(...differentObjects)
}

let refForm = ref()
let submit = async () => {
  await refForm.value.validate()

  let { group_id, plan_desc, plan_title, tableData, id } = form

  // 拖拽排序之后，直接从dom上面获取id
  let scene_case_list = [...tableRef.value.$el.querySelectorAll('span.integration_id')].map(v => v.innerText)
  let validateSceneCaseList = scene_case_list.every(e => tableData.some(v => v.id == e))
  if (!validateSceneCaseList) {
    ElMessage({
      type: 'error',
      message: '集成id不一致，请刷新页面',
    })
    return
  }

  let data = {
    pro_line_id: 1,
    group_id,
    id,
    edit_uid: store.getters.user.username,
    plan_title,
    plan_desc,
    scene_case_list,
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
  width: calc(100% - 40px);
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
