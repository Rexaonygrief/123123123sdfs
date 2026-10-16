const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('windowControls', {
  minimize: () => ipcRenderer.send('window:minimize'),
  toggleMaximize: () => ipcRenderer.send('window:toggle-maximize'),
  close: () => ipcRenderer.send('window:close'),
  togglePin: () => ipcRenderer.send('window:toggle-pin'),
  isMaximized: () => ipcRenderer.invoke('window:is-maximized'),
  getUpdateSnapshot: () => ipcRenderer.invoke('updates:get-snapshot'),
  checkForUpdates: () => ipcRenderer.invoke('updates:check'),
  downloadUpdate: () => ipcRenderer.invoke('updates:download'),
  installUpdate: () => ipcRenderer.invoke('updates:install'),
  onUpdateStatus: (callback) => ipcRenderer.on('updates:status', (_event, status) => callback(status)),
  onUpdateState: (callback) => ipcRenderer.on('updates:state', (_event, state) => callback(state)),
  onMaximized: (callback) => ipcRenderer.on('window:maximized', (_event, state) => callback(state)),
  onPinned: (callback) => ipcRenderer.on('window:pinned', (_event, state) => callback(state))
});
