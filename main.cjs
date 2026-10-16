const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');

let win;
let updateSnapshot = {
  status: 'Нажмите «Проверить обновления».',
  state: 'idle'
};

function sendUpdateStatus(message) {
  updateSnapshot.status = message;
  if (win && !win.isDestroyed()) win.webContents.send('updates:status', message);
}

function sendUpdateState(state) {
  updateSnapshot.state = state;
  if (win && !win.isDestroyed()) win.webContents.send('updates:state', state);
}

function setupAutoUpdater() {
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.on('checking-for-update', () => {
    sendUpdateStatus('Проверяем обновления на сервере…');
    sendUpdateState('checking');
  });
  autoUpdater.on('update-available', info => {
    sendUpdateStatus(`Доступна версия ${info.version}. Нажмите «Обновить».`);
    sendUpdateState('available');
  });
  autoUpdater.on('update-not-available', () => {
    sendUpdateStatus('Установлена актуальная версия.');
    sendUpdateState('idle');
  });
  autoUpdater.on('download-progress', progress => {
    sendUpdateStatus(`Загрузка обновления: ${Math.round(progress.percent)}%`);
    sendUpdateState('downloading');
  });
  autoUpdater.on('update-downloaded', info => {
    sendUpdateStatus(`Версия ${info.version} загружена. Нажмите для перезапуска и установки.`);
    sendUpdateState('downloaded');
  });
  autoUpdater.on('error', error => {
    console.error('Ошибка автообновления:', error);
    sendUpdateStatus('Не удалось проверить обновление; попробуйте позже.');
    sendUpdateState('error');
  });

  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(error => {
      console.error('Проверка обновлений не удалась:', error);
      sendUpdateStatus('Не удалось проверить обновление; попробуйте позже.');
    });
  }, 4000).unref();
}

function createWindow() {
  win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 980,
    minHeight: 640,
    backgroundColor: '#151314',
    title: 'RezoneVPN — демо',
    autoHideMenuBar: true,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  win.once('ready-to-show', () => win.show());
  win.on('maximize', () => win.webContents.send('window:maximized', true));
  win.on('unmaximize', () => win.webContents.send('window:maximized', false));
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  ipcMain.handle('updates:get-snapshot', () => ({ ...updateSnapshot }));
  ipcMain.handle('updates:check', async () => {
    if (!app.isPackaged) {
      sendUpdateStatus('Проверка обновлений доступна в установленной сборке.');
      sendUpdateState('idle');
      return false;
    }
    try {
      sendUpdateState('checking');
      await autoUpdater.checkForUpdates();
      return true;
    } catch (error) {
      console.error('Проверка обновлений не удалась:', error);
      sendUpdateStatus('Не удалось проверить обновление; попробуйте позже.');
      sendUpdateState('error');
      return false;
    }
  });
  ipcMain.handle('updates:download', async () => {
    if (!app.isPackaged || updateSnapshot.state !== 'available') return false;
    try {
      sendUpdateState('downloading');
      await autoUpdater.downloadUpdate();
      return true;
    } catch (error) {
      console.error('Загрузка обновления не удалась:', error);
      sendUpdateStatus('Не удалось загрузить обновление; попробуйте позже.');
      sendUpdateState('error');
      return false;
    }
  });
  ipcMain.handle('updates:install', () => {
    if (!app.isPackaged || updateSnapshot.state !== 'downloaded') return false;
    autoUpdater.quitAndInstall(false, true);
    return true;
  });
  ipcMain.on('window:minimize', () => win && win.minimize());
  ipcMain.on('window:toggle-maximize', () => {
    if (!win) return;
    if (win.isMaximized()) win.unmaximize(); else win.maximize();
  });
  ipcMain.on('window:close', () => win && win.close());
  ipcMain.on('window:toggle-pin', () => {
    if (!win) return;
    win.setAlwaysOnTop(!win.isAlwaysOnTop());
    win.webContents.send('window:pinned', win.isAlwaysOnTop());
  });
  ipcMain.handle('window:is-maximized', () => Boolean(win && win.isMaximized()));
  createWindow();
  setupAutoUpdater();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
