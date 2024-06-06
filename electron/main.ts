import { app, BrowserWindow, ipcMain } from 'electron';
import { createMenu } from './menu';
import { exportReport } from './report';
import { getLanguage } from './translate';
import { openFileDialog, saveFileDialog } from './dialog';
import { run } from './run';
import { setTheme } from './theme';
import {
  addUrlPreference,
  deleteSessionPreference,
  deleteUrlPreference,
  getSessionPreference,
  getUrlsPreference,
  saveSessionPreference,
} from './utils/store';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.maximize();
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
    win?.webContents.send('set-language', getLanguage());
    win?.webContents.send('set-url', getUrlsPreference());
    win?.webContents.send('set-session', getSessionPreference());
  });
  if (VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools();
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
  setTheme();
  createMenu(win);
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
  run(jsonData).then((response) => {
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

ipcMain.on('delete-session', () => {
  deleteSessionPreference();
});
