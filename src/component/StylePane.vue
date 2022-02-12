<template>
  <el-form class="style-pane" label-position="left" label-width="5em" @submit.prevent>
      <el-form-item>
        <template #label>
          <span>窗口底色</span>
        </template>
        <el-color-picker v-model="style.windowBackground" size="small" />
      </el-form-item>
      <el-form-item>
        <template #label>
          <span>猜词CD</span>
        </template>
        <el-checkbox v-model="style.guessCdEnabled" label="启用" />&emsp;
        <el-input-number style="width: 80px" v-model="style.guessCdSeconds" :disabled="!style.guessCdEnabled" :min="1" :max="99" :precision="0" size="small" />&nbsp;秒
      </el-form-item>
      <el-form-item>
        <template #label>
          <b>文本设置</b>
        </template>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span>&emsp;字体</span>
        </template>
        <el-select v-model="style.mainFont" class="select-font" :style="`--font-preview: ${style.mainFont}`" clearable placeholder="默认字体">
          <el-option v-for="font in fontFamilies" :key="font" :style="`font-family: ${font}`" :value="font">{{font}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span>&emsp;进度</span>
        </template>
        <text-settings name="turn" />
      </el-form-item>
      <el-form-item>
        <template #label>
          <span>&emsp;提示</span>
        </template>
        <text-settings name="hint" />
      </el-form-item>
      <el-form-item>
        <template #label>
          <span>&emsp;</span>
        </template>
        <el-checkbox v-model="style.showLengthHint" label="提示字数" />
        <el-checkbox v-model="style.showCategoryHint" label="提示类别" />
      </el-form-item>
      <el-form-item>
        <template #label>
          <span>&emsp;计分板</span>
        </template>
        <text-settings name="bingo" />
      </el-form-item>
      <el-form-item>
        <template #label>
          <span>&emsp;消息</span>
        </template>
        <text-settings name="message" />
      </el-form-item>
  </el-form>
</template>

<style lang="sass" scoped>
.style-pane
  .select-font :deep(.el-input__inner)
    width: 200px
    font-family: var(--font-preview)
</style>

<script setup>
import { inject, shallowRef } from 'vue'
import TextSettings from './TextSettings.vue'

const { style } = inject('config')

const fontFamilies = shallowRef([])
window.electron.getFontFamilies().then(families => fontFamilies.value = families)

</script>