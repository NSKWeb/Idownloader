import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('nika', {
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },
  app: {
    ping: () => ipcRenderer.invoke('app:ping'),
  },
})
