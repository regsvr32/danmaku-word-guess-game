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
import merge from 'deepmerge'
import defaultConfig from './util/appConfig'
import GamePane from './component/GamePane.vue'
import WordsPane from './component/WordsPane.vue'
import StylePane from './component/StylePane.vue'
import AboutPane from './component/AboutPane.vue'

const storagedConfig = localStorage.getItem('config')
const configRaw = merge({}, defaultConfig)
if (storagedConfig) {
  const { words, style } = JSON.parse(storagedConfig)
  configRaw.words = words
  Object.assign(configRaw.style, style)
}
const config = reactive(configRaw)

provide('config', config)

watch(config, debounce(value => localStorage.setItem('config', JSON.stringify(value)), 500))
</script>