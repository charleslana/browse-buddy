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
    return openJsonFile(filePath);
  } else {
    return undefined;
  }
}

export function saveFileDialog(jsonData: string): void {
  const runTest: RunTest = JSON.parse(jsonData);
  delete runTest.repeat;
  const updatedJsonData = JSON.stringify(runTest, null, 2);
  dialog
    .showSaveDialog({
      title: runTest.name,
      defaultPath: path.join(defaultPath, `${runTest.name}.json`),
      filters: [{ name: 'JSON', extensions: ['json'] }],
    })
    .then(fileName => {
      if (fileName && fileName.filePath.length > 0) {
        saveJsonFile(fileName.filePath, updatedJsonData);
      }
    });
}

export function openJsonFile(filePath: string): RunTest | undefined {
  const fileData = readJsonFile(filePath);
  if (!fileData || !isValidJsonStructure(fileData)) {
    return undefined;
  }
  return JSON.parse(fileData) as RunTest;
}

function readJsonFile(filePath: string): string | undefined {
  try {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return fileData;
  } catch (error) {
    logger.error('Erro ao ler arquivo JSON:', error);
    return undefined;
  }
}

function isValidJsonStructure(data: string): boolean {
  try {
    const jsonData = JSON.parse(data);
    runTestSchema.parse(jsonData);
    logger.info('Arquivo validado com sucesso.');
    return true;
  } catch (error) {
    logger.error('Arquivo inválido.');
    return false;
  }
}

function saveJsonFile(filePath: string, jsonData: string): void {
  try {
    fs.writeFileSync(filePath, jsonData, { encoding: 'utf-8' });
    logger.info('Arquivo salvo com sucesso em:', filePath);
  } catch (error) {
    logger.error('Erro ao salvar arquivo:', error);
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
