<template>
  <div class="tree-table">
    <div class="tree-box">
      <comTree v-bind="treeConfig" />
    </div>

    <div class="table-box">
      <comSearch v-bind="{ ...searchConfig, ...$attrs }">
        <template v-if="$slots.prepend" #prepend>
          <slot name="prepend"></slot>
        </template>
      </comSearch>

      <slot name="table"></slot>

      <el-pagination v-model:currentPage="currentPage" v-bind="{ ...pageConfig, ...$attrs }" />
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import comTree from '../tree/baseTree.vue'
import comSearch from '../search/comSearch.vue'

export default {
  props: ['treeConfig', 'searchConfig', 'pageConfig'],
  components: { comTree, comSearch },

  setup(props, {}) {
    const currentPage = ref(props.pageConfig.currentPage)
    return {
      currentPage,
      nodeClick(v) {
        console.log(v)
      },
    }
  },
}
</script>
<style lang="scss" scoped>
.tree-table {
  height: 100%;
  display: flex;

  .tree-box {
    height: inherit;
    min-width: 200px;
    width: 200px;
    // background-color: red;
    overflow-y: auto;
    box-sizing: border-box;
    border-right: 1px solid #efefef;
  }

  .table-box {
    height: inherit;
    flex-grow: 1;
    width: calc(100% - 220px);
    padding: 0 10px;
  }

  :deep .el-table:not(.el-table--border) td {
    border-bottom: var(--el-table-border);
  }
  :deep .el-pagination {
    float: right;

    button,
    li {
      background-color: transparent;
    }
  }
}
</style>
