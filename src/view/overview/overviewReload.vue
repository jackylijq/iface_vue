<template>
    <div class="overview-reload">
        <span>数据时间：{{ time }}</span>
        <el-button type="primary" @click="emits('refresh')">更新数据</el-button>
    </div>
</template>
<script setup>
defineProps({
    time:String
})

let emits = defineEmits(['refresh'])

</script>
<style scoped lang="scss">
.overview-reload{
    position: absolute;
    top: 15px;
    right: 20px;

    span{
        margin-right: 10px;
    }
}
</style>