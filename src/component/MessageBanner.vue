<template>
  <transition name="message-slide">
    <span class="message-content" v-if="lastMessage">{{lastMessage}}</span>
  </transition>
</template>

<style lang="sass" scoped>
.message-slide-enter-active
  transition: transform 0.2s ease
.message-slide-leave-active
  transition: opacity 0.2s cubic-bezier(1, 0, 1, 0)
.message-slide-enter-from
  transform: translateY(100%)
.message-slide-leave-to
  opacity: 0
.message-content
  display: inline-block
  padding: 0.2em 0.5em
  min-height: 1em
</style>

<script setup>
import { ref, nextTick } from 'vue'

class MessageQueue {
  #array = []
  #index = -1

  dequeue() {
    if (++this.#index >= this.#array.length) {
      this.#array = []
      this.#index = -1
      return null
    }
    const item = this.#array[this.#index]
    this.#array[this.#index] = null
    return item
  }
  
  enqueue(item, immediate) {
    if (immediate) {
      this.#array = []
      this.#index = -1
    }
    this.#array.push(item)
  }
}

const messageQueue = new MessageQueue()
const lastMessage = ref(null)

let isBannerBusy = false
function activeNext() {
  lastMessage.value = messageQueue.dequeue()
  if (lastMessage.value == null) {
    isBannerBusy = false
    return
  }
  isBannerBusy = true
  setTimeout(() => {
    lastMessage.value = null
    nextTick(activeNext)
  }, 500)
}

defineExpose({
  setMessage(message, immediate = false) {
    messageQueue.enqueue(message, immediate)
    if (!isBannerBusy) { activeNext() }
  }
})
</script>
