<template>
  <div class="base-tree">
    <el-tree v-bind="computedTreeConfig" ref="myTree" @node-click="nodeClick">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>

          <slot name="treeOperate" :node="node" :data="data"></slot>
          <!-- <span>
            <a @click="append(data)"> Append </a>
            <a style="margin-left: 8px" @click="remove(node, data)"> Delete </a>
          </span> -->
        </span>
      </template>
    </el-tree>
  </div>
</template>
<script>
import { computed, unref, watch, ref, nextTick } from 'vue'
import router from '@/router'

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    nodeClickFn: {
      type: Function,
      defualt() {
        console.log('nodeClickFn方法未定义')
      },
    },
    currentNodeKey: {
      type: String,
      default: '',
    },
  },
  setup(props, { attrs }) {
    const computedTitle = computed(() => props.title || unref(router.currentRoute).meta.title)

    const computedTreeConfig = computed(() => ({
      defaultExpandAll: false,
      expandOnClickNode: false,
      highlightCurrent: true,

      data: [
        {
          label: 'Level one 1',
          children: [
            {
              label: 'Level two 1-1',
              children: [
                {
                  label: 'Level three 1-1-1',
                },
              ],
            },
          ],
        },
      ],
      ...attrs,
    }))

    const myTree = ref(null)
    watch(
      () => props.currentNodeKey,
      () => {
        nextTick(() => {
          unref(myTree)?.setCurrentKey(props.currentNodeKey)
        })
      },
    )

    const nodeClick = function () {
      props.nodeClickFn(...arguments)
    }

    return {
      computedTitle,
      computedTreeConfig,
      myTree,
      nodeClick,
    }
  },
}
</script>
<style lang="scss" scoped>
.base-tree {
  height: 100%;

  :deep .is-current > div:nth-child(1) {
    color: var(--el-color-primary-dark-2);
  }

  :deep .el-tree__empty-block .el-tree__empty-text {
    font-size: 12px;
  }

  :deep .el-tree-node__content{
    .custom-tree-node{
      display: flex;
      flex-grow: 1;
      position: relative;
      line-height: 24px;

      >span:nth-of-type(1){
        width: 0;
        flex-grow: 1;
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
