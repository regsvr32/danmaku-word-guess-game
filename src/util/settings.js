import { app } from 'electron'
import { existsSync, readFileSync, writeFile } from 'fs'
import { promisify } from 'util'
import { join } from 'path'

export const settings = {
  publicWindowBounds: { x: 20, y: 20, width: 560, height: 450 }
}

const settingsFilePath = join(app.getPath('userData'), 'settings.json')
if (existsSync(settingsFilePath)) {
  Object.assign(settings, JSON.parse(readFileSync(settingsFilePath)))
}

export function saveSettings() {
  return promisify(writeFile)(settingsFilePath, JSON.stringify(settings))
}