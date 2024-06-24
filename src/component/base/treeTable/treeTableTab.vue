<template>
  <div class="tree-table">
    <div class="tree-box">
      <comTree ref="refComTree" v-bind="treeConfig">
        <template #treeOperate="{ node, data }">
          <slot name="treeOperate" :node="node" :data="data"></slot>
        </template>
      </comTree>
    </div>
    <el-tabs v-model="data.activeName" @tab-click="handleClick" class="table-box">
      <el-tab-pane v-for="(pane, index) in computedTabsData" :label="pane.label" :key="index" :name="index">
        <div v-if="pane.slot === 'table'" class="tablebox">
          <comSearch v-bind="{ ...searchConfig, ...$attrs }">
            <template v-if="$slots.prepend" #prepend>
              <slot name="prepend"></slot>
            </template>
          </comSearch>
          <slot name="table"></slot>
          <el-pagination v-model:currentPage="currentPage" v-bind="{ ...pageConfig, ...$attrs }" />
        </div>

        <slot v-else :name="pane.slot"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import comTree from '../tree/baseTree.vue'
import comSearch from '../search/comSearch.vue'

export default {
  props: ['treeConfig', 'searchConfig', 'pageConfig', 'tabsData'],
  components: { comTree, comSearch },
  computed: {
    computedTabsData() {
      return this.tabsData.filter(v => !v.show || v.show())
    },
  },
  setup(props, {}) {
    const currentPage = ref(props.pageConfig.currentPage)
    const activeName = reactive('')
    const data = reactive({
      activeName: 0,
    })
    const formData = ref({
      name: '',
      address: '',
    })
    const handleClick = (tab, event) => {
      data.activeName = Number(tab.index)
    }
    const tableData = ref([])
    const queryTableData = ref([])
    const backTableData = ref([])
    return {
      currentPage,
      data,
      formData,
      tableData,
      queryTableData,
      backTableData,
      nodeClick(v) {
        console.log(v)
      },
      handleClick,
      activeName,
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
    overflow: auto;
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

  ::v-deep .el-tabs__header{
    margin-bottom: 0;
  }

  .title {
    font-size: 16px;
    color: #000000d8;
    margin: 0 0 20px 20px;
    font-weight: 700;
    position: relative;
    &::before {
      position: absolute;
      content: '';
      left: -12px;
      top: 0;
      width: 4px;
      height: 20px;
      background: #000000d8;
    }
  }
  .headerTitle {
    font-size: 16px;
    font-weight: 700;
    color: #000000d8;
    margin: 20px 0 20px 20px;
    position: relative;
    &::before {
      position: absolute;
      content: '';
      left: -12px;
      top: 0;
      width: 4px;
      height: 20px;
      background: #000000d8;
    }
  }
  .applyTitle {
    font-size: 14px;
    padding: 10px 0 10px 30px;
    font-weight: 700;
  }
  .postBtn {
    display: inline-block;
    background-color: #339e37;
    color: #fff;
    border-radius: 2px;
    width: 72px;
    height: 32px;
    text-align: center;
  }
  .input {
    width: 320px;
    height: 32px;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 3px;
    display: inline-block;
  }
}
</style>
