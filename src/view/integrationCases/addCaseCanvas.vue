<template>
  <div class="add-case-canvas">
    <div class="add-case-canvas-group" v-for="(group, groupIndex) in items" :key="groupIndex">
      <div class="add-case-canvas-group-item">
        <!--- v-for="(item, index) in group" :key="index" --->
        <figure @click="handleProperty(group)" :class="{ 'active-item': activeCase.id === group.id }">
          <i class="el-icon-close" @click.stop="handleRemove(groupIndex)"></i>
          <img src="" alt="" srcset="" />
          <figcaption :title="group.case_title">{{ group.case_title || '-' }}</figcaption>
        </figure>
        <span class="line-before" :class="{ end: groupIndex === items.length - 1 }"></span>
        <i class="iconfont icon-add" :class="{ active: activeIndex === groupIndex }" @click="handleAdd(groupIndex)"></i>
      </div>
    </div>

    <div class="add-case-canvas-group" v-if="items.length === 0">
      <i class="iconfont icon-add" :class="{ active: activeIndex === 0 }" @click="handleAdd(0)"></i>
    </div>
  </div>
  <add-cases
    :model-value="casesListShow"
    @input="
      val => {
        casesListShow = val
        val === false && (activeIndex = -1)
      }
    "
    @save="handleSave"
  ></add-cases>

  <!-- 设置用例属性 -->
  <el-drawer modal-class="case-property" v-model="propertyShow" :with-header="false" size="50%" direction="btt">
    <add-property :caseInfo="activeCase"></add-property>
  </el-drawer>
</template>
<script setup>
import { defineProps, defineEmits, ref, unref, watchEffect } from 'vue'
import AddCases from './addCases.vue'
import AddProperty from './addProperty.vue'
let props = defineProps({
  items: {
    type: Array,
    default: [],
  },
})

let emits = defineEmits(['update:item'])

// 选中的节点
let activeCase = ref({})
let activeIndex = ref(-1)

// 点击+
let casesListShow = ref(false)
let handleAdd = function (index) {
  activeIndex.value = index
  casesListShow.value = true
}

// 删除用例
let handleRemove = function (index) {
  emits('update:item', { index })
}

// 点击+，选中用例
let handleSave = function (caseInfo = {}) {
  // 向items中插入用例
  emits('update:item', { ...caseInfo, index: unref(activeIndex) })

  // 用例高亮
  activeCase.value = caseInfo.row

  // 展示配置栏
  propertyShow.value = true
}

// 设置节点属性
let propertyShow = ref(false)
watchEffect(() => {
  propertyShow.value === false && (activeCase.value = {})
})
let handleProperty = function (info) {
  propertyShow.value = true
  activeCase.value = info
}
</script>
<style lang="scss" scoped>
.add-case-canvas {
  display: flex;

  width: 1000%;
  height: 1000%;

  padding: 100px;

  i {
    &.icon-add {
      font-size: 20px;
      cursor: pointer;
      border-radius: 50%;

      &:hover {
        color: #fff;
        background-color: #3c63cc;
      }
    }
  }

  .active {
    color: #fff;
    background-color: #3c63cc !important;
  }

  &-group {
    &-item {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 40px;

      > figure {
        display: inherit;
        width: 72px;
        flex-direction: column;
        align-items: center;

        img {
          display: inline-block;
          width: 60px;
          height: 60px;
          border: 1px solid transparent;
        }

        &:hover {
          img {
            cursor: pointer;
            border-color: #3c63cc;
          }
          .el-icon-close {
            display: inline-block;
            background-color: #3c63cc;
            color: #fff;
          }
        }

        &.active-item {
          img {
            border-color: #3c63cc;
            box-shadow: 1px 1px 10px #3c63cc;
          }
        }

        figcaption {
          margin-top: 4px;
          font-size: 12px;
          max-width: 72px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .el-icon-close {
        position: absolute;
        top: -5px;
        left: 58px;
        cursor: pointer;
        border-radius: 50%;
        font-size: 14px;
        display: none;
      }

      > .icon-add {
        background-color: #fff;
        margin: 0 40px;
        transform: translateY(-5px);
        position: relative;
        z-index: 10;
      }

      > .line-before {
        position: absolute;
        z-index: 5;
        left: 70px;
        right: 0px;
        top: 33px;
        height: 2px;
        background-color: #3c63cc;

        &::after {
          content: '';
          position: absolute;
          right: -12px;
          top: -5px;
          width: 0;
          bottom: 0;
          border: 6px solid transparent;
          border-left-color: #3c63cc;
        }

        &::before {
          content: '';
          position: absolute;
          left: -4px;
          top: -5px;
          width: 0;
          bottom: 0;
          border: 6px solid transparent;
          border-left-color: #3c63cc;
        }

        &.end {
          right: 50px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.case-property {
  position: absolute;
}
</style>
