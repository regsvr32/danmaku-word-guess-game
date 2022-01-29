<template>
  <div class="words-pane">
    <template v-for="(group, idx) in words" :key="idx">
      <div class="word-group" :class="{ inactive: !group.active }">
        <div class="group-title">
          <el-switch v-model="group.active" size="small" />
          <span class="label">{{group.category}}</span>
          <el-popconfirm title="确定要删除这组词吗？" @confirm="deleteWordGroup(idx)">
            <template #reference><icon icon="trash" /></template>
          </el-popconfirm>
          <icon icon="edit" @click="editWordGroup(idx)" />
        </div>
        <div class="words">
          <el-space wrap :spacer="verticalDivider">
            <span v-for="(word, jdx) in group.words" :key="`${idx}-${jdx}`">{{word}}</span>
          </el-space>
        </div>
        <el-divider style="margin-bottom: 15px" />
      </div>
    </template>
    <div class="buttons-wrapper">
      <el-button type="primary" @click="editWordGroup(words.length)">新建</el-button>
      <el-button @click="importWords(true)">导入(添加)</el-button>
      <el-button @click="importWords(false)">导入(替换)</el-button>
      <el-button @click="exportWords">导出</el-button>
      <input type="file" ref="openFileTrigger" style="display: none" accept="application/json" @change="onFileSelected" />
      <a ref="downloadTrigger" style="display: none" download="词库.json" />
    </div>
  </div>
  <el-dialog v-model="editingWordGroup.dialogOpen" width="72%" top="12vh" custom-class="edit-word-group-dialog" :close-on-click-modal="false">
    <template #title>编辑词组</template>
    <el-form label-position="top" @submit.prevent>
      <el-form-item label="类别">
        <el-input v-model="editingWordGroup.group.category" />
      </el-form-item>
      <el-form-item label="词语">
        <el-tag closable v-for="(word, idx) in editingWordGroup.group.words" :key="idx" @close="editingWordGroup.group.words.splice(idx, 1)">{{word}}</el-tag>
        <el-input class="new-word" size="small" v-model="editingWordGroup.newWord" @keydown.enter="addNewWord" @blur="addNewWord" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editingWordGroup.dialogOpen = false">取消</el-button>
      <el-button type="primary" :disabled="!editingWordGroup.group.category" @click="saveEditingWordGroup">确定</el-button>
    </template>
  </el-dialog>
</template>

<style lang="sass" scoped>
.words-pane
  .word-group
    transition: color 0.2s ease
    &.inactive
      color: var(--el-text-color-disabled-base)
    .group-title
      margin-bottom: 1em
      .label
        margin: 0px 1em 0px 0.5em
        vertical-align: -2px
        font-size: 18px
      .icon
        cursor: pointer
        width: 16px
        height: 16px
        margin-right: 0.6em
        vertical-align: -3px
        &.edit
          color: var(--el-color-primary-light-2)
        &.trash
          color: var(--el-color-danger)
.edit-word-group-dialog
  .el-tag, .new-word
    margin-right: 0.5em
    margin-bottom: 0.5em
  .new-word
    align-self: baseline
    width: 7em
</style>

<script setup>
import { h, ref, inject } from 'vue'
import { ElDivider, ElMessage } from 'element-plus'
import merge from 'deepmerge'
import Icon from '../asset/Icon.vue'

const verticalDivider = h(ElDivider, { direction: 'vertical' })

const { words } = inject('config')

function deleteWordGroup(idx) {
  words.splice(idx, 1)
}

const downloadTrigger = ref(null)
function exportWords() {
  const blob = new Blob([JSON.stringify(words)])
  downloadTrigger.value.href = URL.createObjectURL(blob)
  downloadTrigger.value.click()
}

const openFileTrigger = ref(null)
let appendImported = false
function importWords(append) {
  appendImported = append
  openFileTrigger.value.value = null
  openFileTrigger.value.click()
}

async function onFileSelected() {
  try {
    const file = openFileTrigger.value.files[0]
    const newWords = JSON.parse(await file.text())
    if (!(newWords instanceof Array)) { throw 1 }
    for (const group of newWords) {
      if (typeof group != "object") { throw 1 }
      if (Object.keys(group).length != 3) { throw 1 }
      if (typeof group.category != "string") { throw 1 }
      if (typeof group.active != "boolean") { throw 1 }
      if (!(group.words instanceof Array)) { throw 1 }
      for (const word of group.words) {
        if (typeof word != "string") { throw 1 }
      }
    }
    if (!appendImported) { words.splice(0, words.length) }
    words.push(...newWords)
    ElMessage.success({
      message: '导入成功',
      duration: 1500,
      showClose: true
    })
  }
  catch {
    ElMessage.error({
      message: '导入失败，请检查文件格式',
      duration: 1500,
      showClose: true
    })
  }
}

const editingWordGroup = ref({ dialogOpen: false, group: {} })
function editWordGroup(idx) {
  editingWordGroup.value = {
    dialogOpen: true, idx, newWord: '', group: merge({}, words[idx] || { category: '', active: true, words: [] })
  }
}

function addNewWord() {
  if (!editingWordGroup.value.newWord) { return }
  editingWordGroup.value.group.words.push(editingWordGroup.value.newWord)
  editingWordGroup.value.newWord = ''
}

function saveEditingWordGroup() {
  words[editingWordGroup.value.idx] = editingWordGroup.value.group
  editingWordGroup.value.dialogOpen = false
}
</script>
