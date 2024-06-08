import packageJson from '../package.json';
import path from 'path';
import translate, { setLanguage } from './translate';
import { app, BrowserWindow, dialog, Menu, nativeTheme, shell } from 'electron';
import { openJsonFile } from './dialog';
import { setThemeModePreference } from './utils/store';

export function createMenu(win: BrowserWindow): void {
  const t = translate.global.t;
  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: t('startMenu'),
      submenu: [
        {
          label: t('reloadMenu'),
          role: 'reload',
        },
        {
          label: t('openDevToolsMenu'),
          role: 'toggleDevTools',
        },
        {
          label: t('closeMenu'),
          role: 'quit',
        },
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
      label: t('exampleMenu'),
      submenu: [
        {
          label: t('actionWaitClick'),
          click: () => {
            const text = openJsonFile(getJsonResourcesPath('1-Wait and click.json'));
            win.webContents.send('set-session', text);
          },
        },
        {
          label: t('actionClick'),
          click: () => {
            const text = openJsonFile(getJsonResourcesPath('2-Click.json'));
            win.webContents.send('set-session', text);
          },
        },
        {
          label: t('actionFill'),
          click: () => {
            const text = openJsonFile(getJsonResourcesPath('3-Fill.json'));
            win.webContents.send('set-session', text);
          },
        },
        {
          label: t('actionType'),
          click: () => {
            const text = openJsonFile(getJsonResourcesPath('4-Type.json'));
            win.webContents.send('set-session', text);
          },
        },
        {
          label: t('actionClear'),
          click: () => {
            const text = openJsonFile(getJsonResourcesPath('5-Clear.json'));
            win.webContents.send('set-session', text);
          },
        },
        {
          label: t('actionWaitVisible'),
          click: () => {
            const text = openJsonFile(getJsonResourcesPath('6-Wait visible.json'));
            win.webContents.send('set-session', text);
          },
        },
        {
          label: t('actionWaitHidden'),
          click: () => {
            const text = openJsonFile(getJsonResourcesPath('7-Wait hidden.json'));
            win.webContents.send('set-session', text);
          },
        },
        {
          label: t('actionClickWaitResponse'),
          click: () => {
            const text = openJsonFile(getJsonResourcesPath('8-Click wait response.json'));
            win.webContents.send('set-session', text);
          },
        },
        {
          label: t('actionEnter'),
          click: () => {
            const text = openJsonFile(getJsonResourcesPath('9-Press Enter.json'));
            win.webContents.send('set-session', text);
          },
        },
      ],
    },
    {
      label: t('helpMenu'),
      submenu: [
        {
          label: t('documentationMenu'),
          click: () => {
            shell.openExternal('https://github.com/charleslana/browse-buddy');
          },
        },
        {
          label: 'GitHub',
          click: () => {
            shell.openExternal('https://github.com/charleslana/browse-buddy');
          },
        },
        {
          label: 'Discord',
          click: () => {
            shell.openExternal('https://discord.gg/rWYTH7qNZ3');
          },
        },
        {
          label: t('issueMenu'),
          click: () => {
            shell.openExternal('https://github.com/charleslana/browse-buddy/issues');
          },
        },
        {
          label: t('aboutMenu'),
          click: () => {
            const projectVersion = packageJson.version;
            dialog.showMessageBox({
              type: 'info',
              title: 'Browse Buddy',
              message: `${t('developedBy')} Charles Lana\n${t('version')}: ${projectVersion}`,
            });
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

function getJsonResourcesPath(file: string): string {
  const resourcePath = app?.isPackaged ? process.resourcesPath : '';
  return path.join(resourcePath, 'resources', 'examples', file);
}
