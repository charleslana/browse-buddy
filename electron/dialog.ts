import fs from 'fs';
import logger from './utils/logger';
import path from 'path';
import { app, dialog } from 'electron';
import { RunTest } from './interfaces/run-test';
import { z } from 'zod';

const defaultPath = app.getPath('downloads');

export function openFileDialog(): RunTest | undefined {
  const filePaths = dialog.showOpenDialogSync({
    title: 'Open File',
    defaultPath: defaultPath,
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (filePaths && filePaths.length > 0) {
    const filePath = filePaths[0];
    const fileData = readJsonFile(filePath);
    if (!fileData || !isValidJsonStructure(fileData)) {
      return undefined;
    }
    return JSON.parse(fileData) as RunTest;
  } else {
    return undefined;
  }
}

export function saveFileDialog(jsonData: string): void {
  const runTest: RunTest = JSON.parse(jsonData);
  dialog
    .showSaveDialog({
      title: runTest.name,
      defaultPath: path.join(defaultPath, `${runTest.name}.json`),
      filters: [{ name: 'JSON', extensions: ['json'] }],
    })
    .then((fileName) => {
      if (fileName && fileName.filePath.length > 0) {
        saveJsonFile(fileName.filePath, jsonData);
      }
    });
}

export function readJsonFile(filePath: string): string | undefined {
  try {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return fileData;
  } catch (error) {
    logger.error('Error reading JSON file:', error);
    return undefined;
  }
}

export function isValidJsonStructure(data: string): boolean {
  try {
    const jsonData = JSON.parse(data);
    runTestSchema.parse(jsonData);
    return true;
  } catch (error) {
    return false;
  }
}

function saveJsonFile(filePath: string, jsonData: string): void {
  try {
    fs.writeFileSync(filePath, jsonData, { encoding: 'utf-8' });
    logger.info('File successfully saved in:', filePath);
  } catch (error) {
    logger.error('Error saving file:', error);
  }
}

const runTestSchema = z.object({
  name: z.string(),
  url: z.string(),
  isSaveLastScreenshot: z.boolean(),
  isSaveEveryScreenshot: z.boolean(),
  isHeadless: z.boolean(),
  defaultTimeout: z.number(),
  actions: z.array(z.any()),
});
