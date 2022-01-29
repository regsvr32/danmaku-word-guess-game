<template>
  <div class="about-pane">
    <div class="contents-wrapper">
      <table class="contents">
        <tr>
          <td>Powered By</td>
          <td>
            <el-link type="primary" @click="open('https://v3.cn.vuejs.org/')">Vue 3</el-link><br/>
            <el-link type="primary" @click="open('https://www.electronjs.org/')">Electron</el-link><br/>
            <el-link type="primary" @click="open('https://fontawesome.com/license')">Font Awesome</el-link><br/>
            <el-link type="primary" @click="open('https://element-plus.org/zh-CN/')">Element Plus</el-link><br/>
          </td>
        </tr>
        <tr>
          <td>源代码</td>
          <td><el-link type="primary" @click="open('https://github.com/regsvr32/danmaku-word-guess-game')">Github</el-link></td>
        </tr>
        <tr>
          <td>联系作者</td>
          <td>QQ: <el-link type="primary" @click="open('https://wpa.qq.com/msgrd?v=3&uin=364944699&site=qq&menu=yes')">364944699</el-link></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.contents
  color: #303133
  td
    padding-right: 1em
    padding-bottom: 0.5em
    vertical-align: top
    white-space: nowrap
    &:first-child
      font-weight: bold
      font-size: 16px
</style>

<script setup>
function open(url) {
  window.electron.openExternal(url)
}
</script>