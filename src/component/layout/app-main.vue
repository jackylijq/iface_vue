<template>
  <section class="container">
    <div class="wrapper" id="wrapper">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive!==false" />
        </keep-alive>
        <component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive===false" />
      </router-view>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
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
