<template>
  <div class="overview-item pie-box">
    <div class="title">产品名称：{{ title }}</div>
    <div class="pie" ref="pieRef"></div>
    <div class="foot">
      <span>接口总数：{{ total }}</span>
      <el-link type="success" :underline="false" :disabled="finish == 0" @click="toInterfaceList('finish')"
        >已实现：{{ finish }}</el-link
      >
      <el-link
        type="error"
        :underline="false"
        :disabled="unrealized_num == 0"
        @click="toInterfaceList('unrealized_num')"
        >未实现：{{ unrealized_num }}</el-link
      >
      <el-link type="info" :underline="false" :disabled="mesi_num == 0" @click="toInterfaceList('mesi_num')"
        >已废弃：{{ mesi_num }}</el-link
      >
    </div>
  </div>
</template>
<script setup>
import { defineProps, nextTick, ref, unref } from 'vue'
import router from '@/router'
let props = defineProps({
  title: String,
  finish: Number,
  total: Number,
  unrealized_num: {
    type: Number,
    default: 0,
  },
  mesi_num: {
    type: Number,
    default: 0,
  },
  pro_id: Number,
})

let pieRef = ref()
nextTick(() => {
  var myChart = echarts.init(unref(pieRef))
  myChart.setOption({
    title: {
      text: ((props.finish / props.total) * 100).toFixed(2) + '%',
      left: 'center',
      top: 'center',
    },
    tooltip: {
      show: false,
    },
    legend: {
      show: false,
    },
    color: ['#70ad47', '#ff0000', '#ccc', '#eaf3e4'],
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        cursor: 'auto',
        emphasis: {
          disabled: true,
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: '#70ad47',
        },

        data: [
          {
            value: props.finish,
            name: '已完成',
            selectedMode: 'false',
          },

          {
            value: props.unrealized_num,
            name: '未实现',
          },
          {
            value: props.mesi_num,
            name: '已废弃',
          },
          {
            value: props.total - props.finish - props.unrealized_num - props.mesi_num,
            name: '其他',
          },
        ],
      },
    ],
  })
})

function toInterfaceList(type) {
  let urlMap = {
    finish: '/iftest/iface/iface_realized',
    unrealized_num: '/iftest/iface/iface_unrealized',
    mesi_num: '/iftest/iface/iface_list',
  }

  let pathMap = {
    finish: '/overview/finish',
    unrealized_num: '/overview/unrealized',
    mesi_num: '/overview/finish_mesi',
  }

  let iface_status = type === 'mesi_num' ? 1 : undefined

  router.push({
    path: pathMap[type],
    query: {
      listUrl: urlMap[type],
      pro_id: props.pro_id,
      iface_status,
    },
  })
}
</script>
<style lang="scss" scoped>
.pie-box {
  font-size: 14px;
  line-height: 20px;
  width: 400px;
}
.pie {
  width: 100%;
  height: 150px;
}
.foot {
  display: flex;
  justify-content: space-between;
}
</style>
<style lang="scss">
.content-box:has(.pie-box) {
  // display: inline-block;
  border: none;

  .content-item {
    border: 1px solid #ccc;
    margin-bottom: 10px;
    margin-right: 10px;
    &::before {
      display: none;
    }
  }
}
</style>
