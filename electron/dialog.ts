import fs from 'fs';
import logger from './utils/logger';
import { app, dialog } from 'electron';

const defaultPath = app.getPath('downloads');

export function openDialog(): string | undefined {
  const filePaths = dialog.showOpenDialogSync({
    title: 'Open File',
    defaultPath: defaultPath,
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (filePaths && filePaths.length > 0) {
    const filePath = filePaths[0];
    try {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      return fileData;
    } catch (error) {
      logger.error('Error opening file:', error);
      return undefined;
    }
  } else {
    return undefined;
  }
}
