<template>
  <el-checkbox v-model="style[`${name}Bold`]" label="加粗" />&emsp;
  字号&nbsp;<el-input-number class="font-size-picker" v-model="style[`${name}Size`]" :min="1" :max="99" :precision="0" size="small" />&emsp;
  字色&nbsp;<el-color-picker v-model="style[`${name}Color`]" size="small" />&emsp;
  描边&nbsp;<el-color-picker v-model="style[`${name}StrokeColor`]" size="small" />
</template>

<style lang="sass" scoped>
.font-size-picker
  margin-left: 1px
  width: 80px
</style>

<script setup>
import { inject } from 'vue'

defineProps(['name'])
const { style } = inject('config')
</script>