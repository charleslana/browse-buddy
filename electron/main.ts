import logger from './utils/logger';
import translate, { getLanguage } from './translate';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { createMenu, updateMenu } from './menu';
import { exportReport } from './report';
import { getAppIconPath } from './utils/utils';
import { openFileDialog, saveFileDialog } from './dialog';
import { run } from './run';
import { setTheme } from './theme';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  addUrlPreference,
  getUrlsPreference,
  deleteUrlPreference,
  saveSessionPreference,
  getSessionPreference,
  deleteSessionPreference,
} from './utils/store';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;

const icon = path.join(process.env.VITE_PUBLIC, getAppIconPath());

function createWindow() {
  win = new BrowserWindow({
    icon: icon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.maximize();
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
    win?.webContents.send('set-language', getLanguage());
  });
  if (VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools();
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
  setTheme();
  createMenu(win, icon);
  autoUpdater.checkForUpdatesAndNotify();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

ipcMain.on('run', (_, jsonData: string) => {
  run(jsonData, win).then(response => {
    win?.webContents.send('run-complete', response);
  });
});

ipcMain.on('open-file', () => {
  const response = openFileDialog();
  win?.webContents.send('set-session', response);
});

ipcMain.on('save-file', (_, jsonData: string) => {
  saveFileDialog(jsonData);
});

ipcMain.on('export-report', (_, jsonData: string) => {
  exportReport(jsonData);
});

ipcMain.on('add-url', (_, url: string) => {
  addUrlPreference(url);
  win?.webContents.send('set-url', getUrlsPreference());
});

ipcMain.on('delete-url', (_, url: string) => {
  deleteUrlPreference(url);
  win?.webContents.send('set-url', getUrlsPreference());
});

ipcMain.on('save-session', (_, jsonData: string) => {
  saveSessionPreference(jsonData);
});

ipcMain.on('get-session', () => {
  win?.webContents.send('set-session', getSessionPreference());
});

ipcMain.on('get-url', () => {
  win?.webContents.send('set-url', getUrlsPreference());
});

ipcMain.on('delete-session', () => {
  deleteSessionPreference();
});

ipcMain.on('show-menu-interface', () => {
  updateMenu(win!, icon, { showApi: false, showInterface: true });
});

ipcMain.on('show-menu-api', () => {
  updateMenu(win!, icon, { showApi: true, showInterface: false });
});

ipcMain.on('hide-menu', () => {
  updateMenu(win!, icon, { showApi: false, showInterface: false });
});

autoUpdater.on('update-available', () => {
  logger.info('Update available.');
  const t = translate.global.t;
  dialog.showMessageBox({
    type: 'info',
    title: t('updateAvailableTitle'),
    message: t('updateAvailableMessage'),
  });
});

autoUpdater.on('update-downloaded', () => {
  logger.info('Update downloaded; will install in 5 seconds');
  const t = translate.global.t;
  dialog
    .showMessageBox({
      type: 'info',
      title: t('updateReadyTitle'),
      message: t('updateReadyMessage'),
      buttons: [t('updateYesButton'), t('updateLaterButton')],
    })
    .then(result => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall(false, true);
      }
    });
});
