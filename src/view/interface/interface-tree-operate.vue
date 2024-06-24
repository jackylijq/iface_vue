<template>
  <span class="tree-operate">
    <svg
      v-if="computedAddIconShow"
      t="1702361338608"
      class="icon add-icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="3895"
      width="16"
      height="16"
      @click.stop="handleAddClick"
    >
      <path
        d="M863.328 482.56l-317.344-1.12L545.984 162.816c0-17.664-14.336-32-32-32s-32 14.336-32 32l0 318.4L159.616 480.064c-0.032 0-0.064 0-0.096 0-17.632 0-31.936 14.24-32 31.904C127.424 529.632 141.728 544 159.392 544.064l322.592 1.152 0 319.168c0 17.696 14.336 32 32 32s32-14.304 32-32l0-318.944 317.088 1.12c0.064 0 0.096 0 0.128 0 17.632 0 31.936-14.24 32-31.904C895.264 496.992 880.96 482.624 863.328 482.56z"
        fill="#5E6570"
        p-id="3896"
      ></path>
    </svg>
    <svg
      v-if="computedEditIconShow"
      t="1702361269485"
      class="icon edit-icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2856"
      width="16"
      height="16"
      @click.stop="handleEditClick"
    >
      <path
        d="M853.333333 501.333333c-17.066667 0-32 14.933333-32 32v320c0 6.4-4.266667 10.666667-10.666666 10.666667H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667V213.333333c0-6.4 4.266667-10.666667 10.666667-10.666666h320c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H170.666667c-40.533333 0-74.666667 34.133333-74.666667 74.666666v640c0 40.533333 34.133333 74.666667 74.666667 74.666667h640c40.533333 0 74.666667-34.133333 74.666666-74.666667V533.333333c0-17.066667-14.933333-32-32-32z"
        fill="#666666"
        p-id="2857"
      ></path>
      <path
        d="M405.333333 484.266667l-32 125.866666c-2.133333 10.666667 0 23.466667 8.533334 29.866667 6.4 6.4 14.933333 8.533333 23.466666 8.533333h8.533334l125.866666-32c6.4-2.133333 10.666667-4.266667 14.933334-8.533333l300.8-300.8c38.4-38.4 38.4-102.4 0-140.8-38.4-38.4-102.4-38.4-140.8 0L413.866667 469.333333c-4.266667 4.266667-6.4 8.533333-8.533334 14.933334z m59.733334 23.466666L761.6 213.333333c12.8-12.8 36.266667-12.8 49.066667 0 12.8 12.8 12.8 36.266667 0 49.066667L516.266667 558.933333l-66.133334 17.066667 14.933334-68.266667z"
        fill="#666666"
        p-id="2858"
      ></path>
    </svg>

    <svg
      v-if="computedDeleteIconShow"
      t="1702361002581"
      class="icon delete-icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="1837"
      id="mx_n_1702361002582"
      width="16"
      height="16"
      @click.stop="handleDeleteClick"
    >
      <path
        d="M789.333333 343.466667c-12.8 0-21.333333 8.533333-21.333333 21.333333v490.666667c0 23.466667-19.2 42.666667-42.666667 42.666666H298.666667c-23.466667 0-42.666667-19.2-42.666667-42.666666V362.666667c0-12.8-8.533333-21.333333-21.333333-21.333334s-21.333333 8.533333-21.333334 21.333334v490.666666c0 46.933333 38.4 85.333333 85.333334 85.333334h426.666666c46.933333 0 85.333333-38.4 85.333334-85.333334V362.666667c0-10.666667-10.666667-19.2-21.333334-19.2zM915.2 234.666667H746.666667V170.666667c0-46.933333-38.4-85.333333-85.333334-85.333334H362.666667c-46.933333 0-85.333333 38.4-85.333334 85.333334v64H106.666667c-12.8 0-21.333333 8.533333-21.333334 21.333333s8.533333 21.333333 21.333334 21.333333h808.533333c12.8 0 21.333333-8.533333 21.333333-21.333333s-8.533333-21.333333-21.333333-21.333333zM320 170.666667c0-23.466667 19.2-42.666667 42.666667-42.666667h298.666666c23.466667 0 42.666667 19.2 42.666667 42.666667v64H320V170.666667z"
        fill="#666666"
        p-id="1838"
      ></path>
      <path
        d="M640 704V364.8c0-12.8-8.533333-21.333333-21.333333-21.333333s-21.333333 8.533333-21.333334 21.333333V704c0 12.8 8.533333 21.333333 21.333334 21.333333s21.333333-10.666667 21.333333-21.333333zM426.666667 704V362.666667c0-12.8-8.533333-21.333333-21.333334-21.333334s-21.333333 8.533333-21.333333 21.333334v341.333333c0 12.8 8.533333 21.333333 21.333333 21.333333s21.333333-10.666667 21.333334-21.333333z"
        fill="#666666"
        p-id="1839"
      ></path>
    </svg>
  </span>

  <el-dialog :title="dialogTitle" :append-to-body="true" v-model="addDialogShow" width="600px">
    <component
      :is="computedType[dialogCom]"
      :data="props.data"
      :isEdit="isEdit"
      @cancel-fn="addDialogShow = false"
      @submit-fn="onSubmit"
    ></component>
  </el-dialog>
</template>
<script setup>
import { computed, defineProps, ref, defineEmits, unref } from 'vue'
import axios from '@/lin/plugin/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import addProduct from './addProduct.vue'
import addGroup from './addGroup.vue'
const props = defineProps({
  node: {},
  data: {},
})

const emits = defineEmits(['refresh-product', 'refresh-group', 'remove-group', 'remove-product'])

const computedAddIconShow = computed(() => {
  return props.node.level === 1
})

const computedEditIconShow = computed(() => {
  return props.data.id !== '-1' && props.node.level <= 2
})

const computedDeleteIconShow = computed(() => {
  return computedEditIconShow.value && props.node.level <= 2
})

// 当前操作的类型 产品 分组 接口
const computedType = computed(() => {
  return [
    '',
    {
      type: 'product',
      label: '产品',
      comAdd: addGroup,
      comAddPro: addProduct,
      addTitle: '分组',
      addCb() {
        if (props.node.level === 1 && props.data.id === '-1') {
          emits(`refresh-product`)
        } else if (props.node.level === 1) {
          emits(`refresh-group`)
        }
      },
      editCb() {
        emits(`refresh-product`)
      },
      deleteFn() {
        return axios({
          method: 'post',
          url: '/iftest/product/proDel',
          data: { id: props.data.otherData.id },
        }).then(res => {
          if (res.code === 200) {
            emits(`remove-product`)
          }
          return res
        })
      },
    },
    {
      type: 'group',
      label: '分组',
      addTitle: '接口',
      comAdd: addGroup,
      editCb() {
        emits(`refresh-group`)
      },
      deleteFn() {
        return axios({
          method: 'post',
          url: '/iftest/iface/group/del',
          data: {
            id: [props.data.otherData.id],
            project_id: props.data.otherData.project_id,
          },
        }).then(res => {
          if (res.code === 200) {
            emits(`remove-group`)
          }
          return res
        })
      },
    },
    {
      type: 'interface',
      label: '接口',
    },
  ][props.node.level]
})

const isEdit = ref(false)
const dialogCom = ref('')
const dialogTitle = ref('')
const addDialogShow = ref(false)
const handleAddClick = function () {
  isEdit.value = false
  // 点击的是全部
  if (props.data.id === '-1') {
    dialogCom.value = 'comAddPro'
    dialogTitle.value = '增加产品'
  } else {
    dialogCom.value = 'comAdd'
    dialogTitle.value = `增加${computedType.value.addTitle}`
  }

  addDialogShow.value = true
}

// 创建和编辑的回调
const onSubmit = function () {
  if (unref(isEdit)) {
    computedType.value?.editCb()
  } else {
    computedType.value?.addCb()
  }
  addDialogShow.value = false
}

const handleEditClick = function () {
  isEdit.value = true
  dialogCom.value = props.node.level === 1 ? 'comAddPro' : 'comAdd'
  dialogTitle.value = `编辑${props.data.label}`
  addDialogShow.value = true
}

const handleDeleteClick = function () {
  ElMessageBox.confirm(`确认删除${computedType.value.label}-${props.data.label}？(下级会一起删除)`, '提示', {
    // confirmButtonText: '确认',
    callback: async action => {
      if (action === 'confirm') {
        let res = await computedType.value.deleteFn()
        ElMessage({
          type: res.code === 200 ? 'success' : 'error',
          message: res.message,
        })
      }

      //
    },
  })
}
</script>
<style lang="scss" scoped>
.tree-operate {
  display: none;
  svg {
    transform: translateY(4px);
  }
}
</style>
<style lang="scss">
.base-tree .el-tree-node__content:hover .tree-operate {
  display: inline-block;
}
</style>
