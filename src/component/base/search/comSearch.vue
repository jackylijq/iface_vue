<template>
  <div class="common-search">
    <el-button v-for="(item, index) in buttonList" :key="index" v-bind="item.config" @click="btnClick(item)">
      {{ item.label }}
    </el-button>

    <Search @query="doQuery">
      <template v-if="$slots.prepend" #prepend>
        <slot name="prepend"></slot> </template
    ></Search>
  </div>
</template>
<script>
import { ref, computed } from 'vue'
import Search from '@/component/base/search/lin-search.vue'

export default {
  props: {
    buttonList: {
      type: Array,
      default() {
        return [
          {
            label: '创建',
            config: {
              type: 'primary',
            },
            emit: 'create',
          },
          {
            label: '删除',
            config: {
              type: 'default',
              disabled: true,
            },
            emit: 'delete',
          },
        ]
      },
    },
    query: {
      type: Function,
      defualt() {
        console.log('query方法未定义')
      },
    },
  },
  components: { Search },
  setup(props, { emit }) {
    const computedButtonList = computed(() => props.buttonList)

    const btnClick = function (item) {
      emit(item.emit, item)
    }

    const doQuery = function () {
      props.query(...arguments)
    }
    return {
      computedButtonList,
      btnClick,
      doQuery,
    }
  },
}
</script>
<style lang="scss" scoped>
.common-search {
  display: flex;
  padding: 8px 0;

  :deep .lin-search {
    margin-left: auto;
  }
}
</style>
