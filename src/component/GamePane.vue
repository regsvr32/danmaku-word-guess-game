<template>
  <div class="game-pane">
    <el-form class="settings" inline @submit.prevent>
      <el-form-item label="房间号">
        <el-input :disabled="isPlaying" v-model="settings.roomId" />
      </el-form-item>
      <el-form-item label="次数">
        <el-input-number :disabled="isPlaying" :min="1" :max="99" :precision="0" v-model="settings.turn" />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" v-if="isPlaying" @click="stopPlay">停止</el-button>
        <el-button type="primary" v-else @click="startPlay" :disabled="!settings.roomId">开始</el-button>
      </el-form-item>
    </el-form>
    <template v-if="isPlaying">
      <p class="current-word-label">向观众描述或画出「{{currentWord.category}}」：</p>
      <div class="current-word">
        {{currentWord.word}}
        <icon icon="sync" @click="refreshWord" />
      </div>
      <p class="timer">{{wordTimerText}}</p>
    </template>
  </div>
</template>

<style lang="sass" scoped>
.game-pane
  .settings
    width: fit-content
    margin: auto
  .current-word-label
    color: var(--el-text-color-secondary)
  .current-word
    text-align: center
    font-size: 50px
    color: var(--el-color-primary)
    .icon.sync
      cursor: pointer
      width: 20px
      height: 20px
      color: var(--el-text-color-secondary)
      line-height: 20px
      vertical-align: super
  .timer
    text-align: end
</style>

<script setup>
import { reactive, ref, inject, watch, toRaw, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { RandomWordPicker } from '../util/RandomWordPicker'
import Icon from '../asset/Icon.vue'

const storagedSetting = localStorage.getItem('playSetting')
const settings = reactive(storagedSetting && JSON.parse(storagedSetting) || { roomId: '', turn: 10 })
const isPlaying = ref(false)

const currentWord = ref({ startTime: 0 })
const wordTimerText = ref('')

function refreshTimerText() {
  const seconds = Math.trunc((new Date() - currentWord.value.startTime) / 1000)
  wordTimerText.value = `${Math.trunc(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
}
let wordTimer = null

async function startPlay() {
  localStorage.setItem('playSetting', JSON.stringify(settings))
  await window.electron.openPublicWindow()
  isPlaying.value = true
  refreshWord()
}

function stopPlay() {
  clearInterval(wordTimer)
  wordTimer = null
  isPlaying.value = false
}

const config = inject('config')

const { words } = config
const wordPicker = new RandomWordPicker(words)
watch(words, value => wordPicker.reset(value), { deep: true })

function refreshWord() {
  currentWord.value = { startTime: new Date().getTime(), ...wordPicker.next() }
  if (wordTimer) { clearInterval(wordTimer) }
  refreshTimerText()
  wordTimer = setInterval(refreshTimerText, 1000)
}

watch([isPlaying, currentWord, () => config.style], ([play, word, style]) => {
  window.electron.updatePublicView({ ready: true, ...settings, play, ...word, style: toRaw(style) })
}, { deep: true })

const cancelWatchPublicWindowClose = window.electron.watchEvent('public-window-closed', stopPlay)
const cancelWatchStopGame = window.electron.watchEvent('stop-game', reason => {
    stopPlay()
    ElMessage[reason ? 'error' : 'success']({
      message: reason || '游戏结束',
      duration: 1500,
      showClose: true
    })
})
const cancelWatchNextWord = window.electron.watchEvent('next-word', () => {
  refreshWord()
  ElMessage.success({
    message: '待猜词语更新了！',
    duration: 1500,
    showClose: true
  })
})
onUnmounted(() => {
  cancelWatchPublicWindowClose()
  cancelWatchStopGame()
  cancelWatchNextWord()
})

window.electron.openPublicWindow().then(() => currentWord.value = {})
</script>