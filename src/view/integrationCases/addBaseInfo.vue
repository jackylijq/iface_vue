<template>
  <el-form ref="refForm" :rules="rules" :model="form" label-width="100px">
    <el-form-item prop="case_title" label="用例标题">
      <el-input v-model="form.case_title" autocomplete="off" maxlength="20" />
    </el-form-item>
    <el-form-item prop="case_desc" label="用例描述">
      <el-input v-model="form.case_desc" autocomplete="off" />
    </el-form-item>
    <el-form-item prop="case_type" label="用例状态">
      <el-radio v-model="form.case_type" label="正常"></el-radio>
      <el-radio v-model="form.case_type" label="异常"></el-radio>
    </el-form-item>
    <el-form-item prop="case_group_id" label="用例分组">
      <el-tree-select
        ref="refEltree"
        v-model="form.case_group_id"
        @change="handleChange"
        check-strictly
        lazy
        nodeKey="id"
        :load="load"
        :props="defaultProps"
      />
    </el-form-item>
    <!-- <el-form-item prop="case_group_id" label="适用阶段">
      <el-tree-select
        ref="refEltree"
        v-model="form.case_group_id"
        @change="handleChange"
        check-strictly
        lazy
        nodeKey="id"
        :load="load"
        :props="defaultProps"
      />
    </el-form-item>
    <el-form-item prop="case_group_id" label="用例分类">
      <el-tree-select
        ref="refEltree"
        v-model="form.case_group_id"
        @change="handleChange"
        check-strictly
        lazy
        nodeKey="id"
        :load="load"
        :props="defaultProps"
      />
    </el-form-item> -->
  </el-form>
</template>
<script setup>


import { defineProps, defineExpose, ref, watchEffect, nextTick } from 'vue'
import axios from '@/lin/plugin/axios'
let props = defineProps({
  form: {
    type: Object,
    default: {},
  },
})

let defaultProps = {
  label: 'label',
  children: 'children',
  isLeaf: 'isLeaf',
}

let refEltree = ref(null)
let load = async function (node, resolve) {
  if (node.isLeaf) return resolve([])
  let { level } = node
  if (level === 0) {
    const res = await axios({
      method: 'post',
      url: '/iftest/condition/group/list',
      data: {
        project_line_id: 1,
        parents_id: 0,
        group_type: 'scene',
      },
    })
    const nodeData = [
      ...res.data.datasList.map(v => ({
        id: v.id,
        label: v.group_name,
        otherData: v,
      })),
    ]
    resolve(nodeData)
    if (nodeData.length > 0 && !props.form.id) {
      props.form.case_group_id = nodeData[0].id
    }
  } else if (level === 1) {
    const { id } = node.data.otherData
    if (id === '-1') {
      resolve([])
      return
    }
    const res = await axios({
      method: 'post',
      url: '/iftest/condition/group/list',
      data: {
        project_line_id: 1,
        parents_id: id,
        group_type: 'scene',
      },
    })
    resolve(
      res.data.datasList.map(v => ({
        id: v.id,
        label: v.group_name,
        otherData: v,
        isLeaf: true,
      })),
    )
  } else {
    resolve([])
  }
}

watchEffect(() => {
  nextTick(() => {
    if (props.form.remark) {
      refEltree.value.$el.querySelector(".el-input__inner").value=props.form.remark
    }
  })
})
let handleChange = function () {
 props.form.remark = refEltree.value.getCurrentNode().label
}

let refForm = ref('refForm')
let rules = {
  case_title: [{ required: true, message: '用例标题不能为空', trigger: 'change' }],
  case_group_id: [{ required: true, message: '用例分组不能为空', trigger: 'change' }],
}

defineExpose({
  refForm,
})
</script>
<style lang="scss" scoped></style>
