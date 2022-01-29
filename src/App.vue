<template>
  <el-tabs class="app-tabs" type="border-card">
    <el-tab-pane label="房间"><game-pane /></el-tab-pane>
    <el-tab-pane label="词库"><words-pane /></el-tab-pane>
    <el-tab-pane label="样式"><style-pane /></el-tab-pane>
    <el-tab-pane label="关于"><about-pane /></el-tab-pane>
  </el-tabs>
</template>

<style lang="sass">
body
  box-sizing: border-box
  margin: 0px

*
  user-select: none

.app-tabs
  box-sizing: border-box
  height: 100vh
  &>.el-tabs__content
    box-sizing: border-box
    height: calc(100% - 38px)
    overflow-y: auto
</style>

<script setup>
import { reactive, provide, watch } from 'vue'
import debounce from 'lodash/debounce'
import defaultConfig from './util/appConfig'
import GamePane from './component/GamePane.vue'
import WordsPane from './component/WordsPane.vue'
import StylePane from './component/StylePane.vue'
import AboutPane from './component/AboutPane.vue'

const storagedConfig = localStorage.getItem('config')
const config = reactive(storagedConfig && JSON.parse(storagedConfig) || defaultConfig)
provide('config', config)

watch(config, debounce(value => localStorage.setItem('config', JSON.stringify(value)), 500))
</script>