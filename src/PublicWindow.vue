<template>
  <div class="public-view" v-bind="viewBinds">
    <template v-if="viewData.ready">
      <div class="header">
        <template v-if="viewData.play">
          <div class="turn">{{Math.min(nowTurn + 1, viewData.turn)}}/{{viewData.turn}}</div>
          <div class="hint">
            <span class="length-hint" v-if="viewData.style.showLengthHint">{{viewData.word.length}}个字</span>
            <span class="category-hint" v-if="viewData.style.showCategoryHint">{{viewData.category}}</span>
          </div>
        </template>
        <div class="turn is-stop" v-else>游戏已结束</div>
      </div>
      <div class="bingo">
        <div class="bingo-user" v-for="({ uname, times }, uid) of bingos" :key="uid">
          <div class="uname">{{uname}}</div>
          <div class="flower-wrapper">
            <span class="flower" v-for="i in times" :key="`${uid}-${i}`">🌹</span>
          </div>
        </div>
      </div>
      <div class="message">
        <message-banner ref="messageBanner" />
      </div>
    </template>
  </div>
</template>

<style lang="sass">
:root
  --window-background-color: #4c4c4c
  --main-font: sans-serif

body
  margin: 0px
  color: #ffffff
  overflow: hidden

*
  user-select: none

::-webkit-scrollbar
  width: 8px
  height: 8px
::-webkit-scrollbar-track
  background: none
::-webkit-scrollbar-thumb
  border-radius: 4px
  background-color: #ffffff10
  &:hover
    background-color: #ffffff40

@mixin text-rules($name)
  .#{$name}-bold .#{$name}
    font-weight: bold
  .#{$name}
    color: var(--#{$name}-color)
    font-size: var(--#{$name}-size)
    text-shadow: var(--#{$name}-stroke)

@include text-rules("turn")
@include text-rules("hint")
@include text-rules("message")
@include text-rules("bingo")

.public-view
  background-color: var(--window-background-color)
  font-family: var(--main-font)
  width: 100vw
  height: 100vh
  display: flex
  flex-direction: column
  .header
    display: flex
    padding: 8px 1em
    .turn
      width: 3em
    .hint
      text-align: center
      flex-grow: 1
      padding-right: 1em
      .length-hint + .category-hint
        margin-left: 0.5em
  .bingo
    padding: 0px 12px
    display: flex
    flex-wrap: wrap
    flex: 1
    overflow-y: auto
    align-content: flex-start
    .bingo-user
      width: 10em
      min-height: 4em
      padding: 4px
      @keyframes flower-appear
        0%
          transform: scale(0)
        80%
          transform: scale(1.5)
      .flower
        display: inline-block
        font-family: sans-serif
        text-shadow: none
        animation: flower-appear 0.2s ease
  .is-stop
    padding-right: 1em
    text-align: center
    flex-grow: 1
</style>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'
import { connectRoomChat } from './util/bilibiliLiveRoomChat'
import logger from './util/logger'
// eslint-disable-next-line
import MessageBanner from './component/MessageBanner.vue'

const viewData = ref({ ready: false, style: {} })
const viewBinds = computed(() => {
  if (!viewData.value.ready) { return {} }
  const { style } = viewData.value
  const binds = {
    class: { }, style: {
      '--window-background-color': style.windowBackground || '#4c4c4c',
      '--main-font': style.mainFont || 'sans-serif'
    }
  }
  function setStyles(name) {
    binds.class[`${name}-bold`] = style[`${name}Bold`]
    binds.style[`--${name}-color`] = style[`${name}Color`] || 'inherit'
    const size = style[`${name}Size`]
    binds.style[`--${name}-size`] = size && `${size}px` || 'inherit'
    const strokeColor = style[`${name}StrokeColor`]
    binds.style[`--${name}-stroke`] = strokeColor && `0px 1px ${strokeColor}, 1px 0px ${strokeColor}, -1px 0px ${strokeColor}, 0px -1px ${strokeColor}` || 'none'
  }
  setStyles('turn')
  setStyles('hint')
  setStyles('message')
  setStyles('bingo')
  return binds
})

const nowTurn = ref(0)
const bingos = ref({})

const cancelWatchUpdateView = window.electron.watchUpdateView(data => viewData.value = data)
onUnmounted(cancelWatchUpdateView)

const messageBanner = ref(null)

let lastWrongWord = null
let waitForRefresh = false
let userLastGuess = {}

function onDanmakuMessage(uid, uname, msg, sc) {
  const { turn, play, word, style: { guessCdEnabled, guessCdSeconds } } = viewData.value
  if (!play || waitForRefresh) { return }
  if (!sc && guessCdEnabled) {
    const now = new Date()
    if (userLastGuess[uid] && now - userLastGuess[uid] < guessCdSeconds * 1000) {
      messageBanner.value.setMessage(`${uname}，您猜得太快了`)
      return
    }
    userLastGuess[uid] = now
  }
  if (msg.startsWith(word) && /^[吧吗哈嘛呢啊啦…；？！，。;?!,.]*$/.test(msg.substring(word.length))) {
    if (bingos.value[uid]) {
      bingos.value[uid].times += 1
    }
    else {
      bingos.value[uid] = { uname, times: 1 }
    }
    waitForRefresh = true
    nowTurn.value += 1
    window.electron[nowTurn.value >= turn ? 'stopGame' : 'nextWord']()
    let message = `正确答案【${word}】，${uname}猜对了！`
    if (sc) { message += '甚至是SC！' }
    messageBanner.value.setMessage(message, true, 1000)
    return
  }
  if (msg == lastWrongWord) { return }
  lastWrongWord = msg
  let message = `不是【${msg}】`
  if (sc) { message += '，即使用SC也不是' }
  messageBanner.value.setMessage(message)
}

watch(() => viewData.value.play, play => {
  if (play) {
    nowTurn.value = 0
    bingos.value = {}
  }
  else if (messageBanner.value) {
    messageBanner.value.setMessage('游戏已结束', true)
  }
})

watch(() => viewData.value.startTime, () => {
  lastWrongWord = null
  waitForRefresh = false
  userLastGuess = {}
  if (messageBanner.value) {
    messageBanner.value.setMessage('待猜词语更新了！', true)
  }
})

let session = null
watch(() => viewData.value.roomId, async roomId => {
  if (!roomId) { return }
  if (session && session.readyState === WebSocket.OPEN) {
    const oldSession = session
    session = null
    oldSession.close()
  }
  try {
    session = await connectRoomChat(roomId)
  }
  catch {
    window.electron.stopGame('连接失败')
    return
  }
  session.onclose = function () {
    if (this == session) { window.electron.stopGame('连接中断') }
  }
  session.addEventListener('normal-message', ({ data }) => {
    logger.debug(data)
    switch (data.cmd) {
      case 'DANMU_MSG': {
        const [ , msg, [uid, uname]] = data.info
        onDanmakuMessage(uid, uname, msg, false)
        break
      }
      case 'SUPER_CHAT_MESSAGE': {
        const { message, uid, user_info: { uname } } = data.data
        onDanmakuMessage(uid, uname, message, true)
        break
      }
    }
  })
})
</script>