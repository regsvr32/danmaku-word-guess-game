import { ipcRenderer, contextBridge, shell } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  openExternal(url) {
    shell.openExternal(url)
  },
  getFontFamilies() {
    return ipcRenderer.invoke('get-font-families')
  },
  openPublicWindow() {
    return ipcRenderer.invoke('open-public-window')
  },
  updatePublicView(viewData) {
    ipcRenderer.send('update-public-view', viewData)
  },
  watchEvent(channel, callback) {
    const stripCallback = (_, ...args) => callback(...args)
    ipcRenderer.on(channel, stripCallback)
    return () => {
      ipcRenderer.removeListener(channel, stripCallback)
    }
  }
})