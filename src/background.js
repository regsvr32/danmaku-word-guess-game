'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { existsSync, readFile, writeFile } from 'fs'
import { promisify } from 'util'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { join } from 'path'
import { regisiterApi, closePublicWindow } from './ipc-main'

const isDevelopment = process.env.NODE_ENV !== 'production'
regisiterApi()

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: join(__dirname, './main-preload.js')
    }
  })
  process.env.MAIN_WINDOW_ID = win.id

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) { win.webContents.openDevTools({ mode: 'detach' }) }
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('close', () => {
    if (win.webContents.isDevToolsOpened()) { win.webContents.closeDevTools() }
    closePublicWindow()
  })

  const webRequest = win.webContents.session.webRequest
  webRequest.onBeforeSendHeaders((details, callback) => {
    if (details.url.includes('bilibili')) {
      delete details.requestHeaders.Origin
      delete details.requestHeaders.Referer
      details.requestHeaders['Sec-Fetch-Mode'] = 'navigate'
      details.requestHeaders['Sec-Fetch-Site'] = 'none'
    }
    callback({ requestHeaders: details.requestHeaders })
  })
  webRequest.onHeadersReceived((details, callback) => {
    if (details.url.includes('bilibili')) {
      details.responseHeaders['Access-Control-Allow-Origin'] = ['*']
    }
    callback({ responseHeaders: details.responseHeaders })
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.on('browser-window-created', (_, window) => window.setMenu(null))

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
