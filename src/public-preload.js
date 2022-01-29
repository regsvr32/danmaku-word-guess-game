import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  selectFastest(host_list) {
    return ipcRenderer.invoke('select-fastest', host_list)
  },
  decompress(type, array) {
    return ipcRenderer.invoke(`${type}-decompress`, array)
  },
  watchUpdateView(callback) {
    const stripCallback = (_, viewData) => callback(viewData)
    ipcRenderer.on('update-view', stripCallback)
    return () => {
      ipcRenderer.removeListener('update-view', stripCallback)
    }
  },
  nextWord() {
    ipcRenderer.send('next-word')
  },
  stopGame(reason) {
    ipcRenderer.send('stop-game', reason)
  }
})