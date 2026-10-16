const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');

let win;

function sendUpdateStatus(message) {
  if (win && !win.isDestroyed()) win.webContents.send('updates:status', message);
}

function setupAutoUpdater() {
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => sendUpdateStatus('Проверяем новые версии…'));
  autoUpdater.on('update-available', info => {
    sendUpdateStatus(`Доступна версия ${info.version}; загружаем…`);
  });
  autoUpdater.on('update-not-available', () => sendUpdateStatus('Установлена актуальная версия.'));
  autoUpdater.on('download-progress', progress => {
    sendUpdateStatus(`Загрузка обновления: ${Math.round(progress.percent)}%`);
  });
  autoUpdater.on('update-downloaded', async info => {
    sendUpdateStatus(`Версия ${info.version} загружена; ожидает перезапуска.`);
    try {
      const parent = win && !win.isDestroyed() ? win : undefined;
      const { response } = await dialog.showMessageBox(parent, {
        type: 'info',
        title: 'Обновление RezoneVPN',
        message: `Версия ${info.version} готова к установке.`,
        detail: 'Перезапустите приложение сейчас или закройте его позже — установка начнётся при выходе.',
        buttons: ['Перезапустить сейчас', 'Позже'],
        defaultId: 0,
        cancelId: 1
      });
      if (response === 0) autoUpdater.quitAndInstall(false, true);
    } catch (error) {
      console.error('Не удалось показать диалог обновления:', error);
    }
  });
  autoUpdater.on('error', error => {
    console.error('Ошибка автообновления:', error);
    sendUpdateStatus('Не удалось проверить обновление; попробуйте позже.');
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
