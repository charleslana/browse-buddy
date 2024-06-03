import translate, { setLanguage } from './translate';
import { BrowserWindow, Menu, nativeTheme } from 'electron';
import { setThemeModePreference } from './utils/store';

export function createMenu(win: BrowserWindow): void {
  const t = translate.global.t;
  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          role: 'quit',
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: t('themes'),
      submenu: [
        {
          label: t('lightTheme'),
          click: () => {
            nativeTheme.themeSource = 'light';
            setThemeModePreference('light');
          },
        },
        {
          label: t('darkTheme'),
          click: () => {
            nativeTheme.themeSource = 'dark';
            setThemeModePreference('dark');
          },
        },
        {
          label: t('systemTheme'),
          click: () => {
            nativeTheme.themeSource = 'system';
            setThemeModePreference('system');
          },
        },
      ],
    },
    {
      label: t('languages'),
      submenu: [
        {
          label: t('langEnglish'),
          click: () => {
            setLanguage('en');
            win?.webContents.send('set-language', 'en');
            updateMenu(win);
          },
        },
        {
          label: t('langSpanish'),
          click: () => {
            setLanguage('es');
            win?.webContents.send('set-language', 'es');
            updateMenu(win);
          },
        },
        {
          label: t('langPortuguese'),
          click: () => {
            setLanguage('pt');
            win?.webContents.send('set-language', 'pt');
            updateMenu(win);
          },
        },
      ],
    },
    {
      label: 'Window',
      submenu: [{ role: 'minimize' }, { role: 'zoom' }, { type: 'separator' }, { role: 'close' }],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://electronjs.org');
          },
        },
      ],
    },
  ];
  buildMenu(menuTemplate);
}

function buildMenu(menuTemplate: Electron.MenuItemConstructorOptions[]): void {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

function updateMenu(win: BrowserWindow): void {
  createMenu(win);
}
