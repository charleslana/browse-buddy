import path from 'path';
import { CoreError } from '@puppeteer/error';

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateDateTime() {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, -5);
  return timestamp;
}

export function getAppIconPath(): string {
  if (process.platform === 'linux') {
    return 'icon256x.png';
  } else if (process.platform === 'win32') {
    return 'favicon.ico';
  }
  return '';
}

export function getDefaultDir(): string {
  if (process.platform === 'linux') {
    return path.join(process.env.HOME || '', '.config', 'browse-buddy');
  } else if (process.platform === 'win32') {
    return path.join(process.env.APPDATA || '', 'browse-buddy');
  }
  throw new CoreError(`Sistema operacional não suportado: ${process.platform}`);
}
