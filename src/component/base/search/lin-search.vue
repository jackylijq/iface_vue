<template>
  <div class="lin-search">
    <el-input
      :placeholder="placeholder"
      clearable
      v-model="keyword"
      @keyup.enter.native="search"
      class="input-with-select"
    >
      <template v-if="$slots.prepend" #prepend>
        <slot name="prepend"></slot>
      </template>

      <template #suffix>
        <i class="el-input__icon el-icon-search" @click="search"></i>
      </template>
    </el-input>

    <el-button @click="refresh"><i class="el-input__icon el-icon-refresh"></i></el-button>
  </div>
</template>

<script>
import Utils from 'lin/util/util'

export default {
  props: {
    defaultSearchValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请输入内容',
    },
  },
  data() {
    return {
      keyword: '',
    }
  },
  watch: {
    defaultSearchValue: {
      handler() {
        this.keyword = this.defaultSearchValue
      },
    },
  },
  mounted() {
    // if (this.defaultSearchValue) {
    //   this.keyword = this.defaultSearchValue
    // }
    // 节流搜索
    // this.$watch(
    //   'keyword',
    //   Utils.debounce(newQuery => {
    //     this.$emit('query', newQuery)
    //   }, 300),
    // )
  },
  methods: {
    clear() {
      this.keyword = ''
    },
    search() {
      this.$emit('query', this.keyword)
    },
    refresh() {
      this.keyword=""
      this.$emit('refresh')
    }
  },
}
</script>
<style lang="scss" scoped>
.lin-search {
  display: flex;
}
.lin-search :v-deep(.el-input__inner) {
  width: 150px;

  border-radius: 20px;
  transition: all 0.2s linear;

  &:focus {
    width: 250px;
    transition: all 0.3s linear;
  }
}
.lin-search :v-deep(.el-input__suffix) {
  cursor: pointer;
}

.lin-search ::v-deep(.el-button) {
  height: 34px;
  margin-left: 4px;
}
</style>
