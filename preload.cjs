const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('windowControls', {
  minimize: () => ipcRenderer.send('window:minimize'),
  toggleMaximize: () => ipcRenderer.send('window:toggle-maximize'),
  close: () => ipcRenderer.send('window:close'),
  togglePin: () => ipcRenderer.send('window:toggle-pin'),
  isMaximized: () => ipcRenderer.invoke('window:is-maximized'),
  onUpdateStatus: (callback) => ipcRenderer.on('updates:status', (_event, status) => callback(status)),
  onMaximized: (callback) => ipcRenderer.on('window:maximized', (_event, state) => callback(state)),
  onPinned: (callback) => ipcRenderer.on('window:pinned', (_event, state) => callback(state))
});
