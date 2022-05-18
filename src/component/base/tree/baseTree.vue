<template>
  <div class="base-tree">
    <el-tree v-bind="computedTreeConfig" ref="myTree" @node-click="nodeClick"></el-tree>
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
}
</style>
