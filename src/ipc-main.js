import { ipcMain, BrowserWindow } from 'electron'
import ping from 'ping'
import { decompress } from 'brotli'
import { join } from 'path'
import fontManager from 'node-system-fonts'
import { settings, saveSettings } from './util/settings'

let fontFamilies = null
let publicWindow = null

export function regisiterApi() {
  ipcMain.handle('select-fastest', (_, host_list) => {
    return Promise.any(host_list.map(async host => {
      const { alive } = await ping.promise.probe(host.host)
      if (!alive) { throw new Error('host not alive') }
      return host
    }))
  })

  ipcMain.handle('brotli-decompress', (_, array) => {
    return decompress(Buffer.from(array))
  })

  ipcMain.handle('get-font-families', () => {
    return new Promise(res => {
      if (fontFamilies != null) {
        res(fontFamilies)
        return
      }
      fontManager.getAvailableFonts(fonts => {
        fontFamilies = [...new Set(fonts.map(font => font.family))]
        res(fontFamilies)
      })
    })
  })

  ipcMain.handle('open-public-window', () => {
    return new Promise(res => {
      if (publicWindow != null) { res(); return }
      const mainWindow = BrowserWindow.fromId(process.env.MAIN_WINDOW_ID * 1)
      
      publicWindow = new BrowserWindow({
        ...settings.publicWindowBounds,
        alwaysOnTop: true,
        minimizable: false,
        //parent: mainWindow,
        webPreferences: {
          nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
          contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
          preload: join(__dirname, './public-preload.js')
        }
      })

      publicWindow.loadURL((process.env.WEBPACK_DEV_SERVER_URL || 'app://./') + 'public.html').then(() => {
        if (process.env.WEBPACK_DEV_SERVER_URL && !process.env.IS_TEST) {
          publicWindow.webContents.openDevTools({ mode: 'detach' })
        }
      })

      publicWindow.once('close', () => {
        if (publicWindow.webContents.isDevToolsOpened()) { publicWindow.webContents.closeDevTools() }
        publicWindow = null
        mainWindow.webContents.send('public-window-closed')
      })

      publicWindow.on('moved', () => {
        const [x, y] = publicWindow.getPosition()
        Object.assign(settings.publicWindowBounds, { x, y })
        saveSettings()
      })

      publicWindow.on('resized', () => {
        const [width, height] = publicWindow.getSize()
        Object.assign(settings.publicWindowBounds, { width, height })
        saveSettings()
      })

      publicWindow.once('ready-to-show', res)
    })
  })

  ipcMain.on('update-public-view', (_, viewData) => {
    if (publicWindow != null) {
      publicWindow.webContents.send('update-view', viewData)
    }
  })

  ipcMain.on('stop-game', (_, reason) => {
    BrowserWindow.fromId(process.env.MAIN_WINDOW_ID * 1).webContents.send('stop-game', reason)
  })

  ipcMain.on('next-word', () => {
    BrowserWindow.fromId(process.env.MAIN_WINDOW_ID * 1).webContents.send('next-word')
  })
}

export function closePublicWindow() {
  if (publicWindow != null) { publicWindow.close() }
}