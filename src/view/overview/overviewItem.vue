<template>
  <div class="overview-item">
    <div class="header-title">{{ title }}</div>
    <ul class="content-box">
      <li class="content-item" v-for="item in contentSchema" :key="item.label">
        <slot :componentData="item">
          <span>{{ item.title }}</span>
          <span>{{ item.value }}</span>
        </slot>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps({
  title: String,
  contentSchema: Array,
})
</script>
<style lang="scss" scoped>
.overview-item {
  display: inline-flex;
  flex-direction: column;
  margin-left: 20px;
  margin-top: 20px;
}
.header-title {
  line-height: 20px;
  height: 20px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #000000d8;
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

.content-box {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #ccc;
  padding-bottom: 8px;

  .content-item {
    position: relative;
    display: inherit;
    min-width: 100px;
    max-width: 400px;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    padding: 10px 10px 10px;

    &:nth-child(n + 2)::before {
      content: '';
      position: absolute;
      width: 1px;
      height: 90%;
      left: 0;
      top: 10px;
      background: #ccc;
    }

    span:nth-child(1) {
      margin: 18px 0;
      font-size: 14px;
      text-align: center;
    }
    span:nth-child(2) {
      font-weight: 700;
      font-size: 18px;
      text-align: center;
    }
  }
}
</style>
