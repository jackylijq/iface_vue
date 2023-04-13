<template>
  <div class="add-case-canvas">
    <div class="add-case-canvas-group" v-for="(group, groupIndex) in items" :key="groupIndex">
      <div class="add-case-canvas-group-item">
        <!--- v-for="(item, index) in group" :key="index" --->
        <figure @click="handleProperty(group)" :class="{ 'active-item': activeCase.id === group.id }">
          <i class="el-icon-close" @click.stop="handleRemove(groupIndex)"></i>
          <svg
            t="1676442394398"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2594"
            width="60"
            height="60"
          >
            <path
              d="M512 980A468.11 468.11 0 0 1 329.82 80.79a468.12 468.12 0 0 1 364.36 862.42A465.15 465.15 0 0 1 512 980z m0-876a408.11 408.11 0 0 0-158.8 784 408.11 408.11 0 0 0 317.6-751.9A405.36 405.36 0 0 0 512 104z"
              p-id="2595"
              fill="#1296db"
            ></path>
            <path
              d="M859.46 581.45a30 30 0 0 1-29.72-26.17A320.53 320.53 0 0 0 401.56 296a30 30 0 0 1-20.71-56.31 380.42 380.42 0 0 1 508.4 307.94 30 30 0 0 1-29.79 33.84zM163.73 590.83a29 29 0 0 1-3.07-0.16 30 30 0 0 1-26.81-32.88 378.76 378.76 0 0 1 76.35-192.32A30 30 0 0 1 257.82 402a318.85 318.85 0 0 0-64.28 161.89 30 30 0 0 1-29.81 26.94z"
              p-id="2596"
              fill="#1296db"
            ></path>
            <path d="M512 512m-60 0a60 60 0 1 0 120 0 60 60 0 1 0-120 0Z" p-id="2597" fill="#1296db"></path>
            <path
              d="M572 602a29.88 29.88 0 0 1-21.21-8.79l-292-292a30 30 0 0 1 42.42-42.42l292 292A30 30 0 0 1 572 602z"
              p-id="2598"
              fill="#1296db"
            ></path>
          </svg>
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
    :value="casesListShow"
    @input="
      val => {
        casesListShow = val
        val === false && (activeIndex = -1)
      }
    "
    @save="handleSave"
  ></add-cases>

  <!-- 设置用例属性 -->
  <el-drawer modal-class="case-property" v-model="propertyShow" :with-header="false" size="70%" direction="btt">
    <add-property :caseInfo="activeCase" @update:caseInfo="updateCaseInfo"></add-property>
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

let updateCaseInfo = ({ key, data }) => {
  activeCase.value[key] = data
}
</script>
<style lang="scss" scoped>
.add-case-canvas {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 60px;

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
        cursor: pointer;

        &:hover {
          .el-icon-close {
            display: inline-block;
            background-color: #3c63cc;
            color: #fff;
          }
          svg {
            border-radius: 50%;
            box-shadow: 1px 5px 10px #838999;
          }
        }

        &.active-item {
          svg {
            border-radius: 50%;
            box-shadow: 1px 5px 10px #838999;
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
