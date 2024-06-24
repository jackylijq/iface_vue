<template>
  <section class="container">
    <div class="wrapper" id="wrapper">
      <router-view v-slot="{ Component }">
        <keep-alive ref="refKeepAlive">
          <component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive !== false" />
        </keep-alive>
        <component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive === false" />
      </router-view>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  watch: {
    $route: {
      handler() {
        this.rmCache()
      },
    },
  },

  methods: {
    rmCache() {
      let history = JSON.parse(window.localStorage.getItem('history') || '[]')
      let cachesMap = this.$refs.refKeepAlive.$.__v_cache
      
      ;[...cachesMap.keys()].forEach(key => {
        if (!history.some(v => v.path === key)) {
          cachesMap.delete(key)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;

  .wrapper {
    width: 100%;
    height: 100%;
    text-align: left;
  }
}
</style>
