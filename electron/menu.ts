import packageJson from '../package.json';
import translate, { setLanguage } from './translate';
import { BrowserWindow, dialog, Menu, nativeTheme, shell } from 'electron';
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
          click: () => {},
        },
        {
          label: t('actionClick'),
          click: () => {},
        },
        {
          label: t('actionFill'),
          click: () => {},
        },
        {
          label: t('actionType'),
          click: () => {},
        },
        {
          label: t('actionClear'),
          click: () => {},
        },
        {
          label: t('actionWaitVisible'),
          click: () => {},
        },
        {
          label: t('actionWaitHidden'),
          click: () => {},
        },
        {
          label: t('actionClickWaitResponse'),
          click: () => {},
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
