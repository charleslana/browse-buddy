import fs from 'fs';
import logger from '@electron/utils/logger';
import path from 'path';
import translate from '@electron/translate';
import { ApiDetail } from './interfaces/api-detail';
import { ApiPage } from './api-page';
import { BrowserWindow } from 'electron';
import { Core } from './core';
import { CoreError } from './error';
import { ElementHandle, Frame, Page as PuppeteerPage } from 'puppeteer';
import { ExecutionResult } from './interfaces/execution-result';
import { generateUUID, getDefaultDir } from '@electron/utils/utils';

export class Page {
  constructor(core: Core) {
    this.core = core;
    this.apiPage = new ApiPage();
  }

  private core: Core;
  private page: PuppeteerPage = <PuppeteerPage>{};
  private t = translate.global.t;
  private window: BrowserWindow | null = null;
  private apiPage: ApiPage = <ApiPage>{};

  public setWindow(win: BrowserWindow | null): void {
    this.window = win;
  }

  public async navigate(url: string, saveScreenshot?: boolean): Promise<ExecutionResult> {
    const log = `Tentando navegar para ${url} ...`;
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      this.page = await this.core.getPage();
      await this.page.goto(url, {
        waitUntil: 'domcontentloaded',
      });
      const log = `Sucesso ao navegar para ${url}`;
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error = this.t('navigateError', [url]);
      this.window?.webContents.send('log-result', error);
      logger.error(`Erro ao navegar para ${url}: ${e}`);
    } finally {
      if (!error) {
        screenshot = await this.saveScreenshot(generateUUID(), saveScreenshot);
      }
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async waitForClick(
    selector: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<ExecutionResult> {
    const log = `Tentando aguardar e clicar no elemento com seletor ${selector} ...`;
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      const result = await this.waitForVisible(selector, id, saveScreenshot);
      error = result.error;
      await this.page.click(selector);
      const log = `Sucesso ao aguardar e clicar no elemento com seletor ${selector}`;
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error += this.t('waitForClickError', [selector]);
      this.window?.webContents.send('log-result', error);
      logger.error(`Erro ao aguardar e clicar no elemento com seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async click(
    selector: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<ExecutionResult> {
    const log = `Tentando clicar no elemento com seletor ${selector} ...`;
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.click(selector);
      const log = `Sucesso ao clicar no elemento com seletor ${selector}`;
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error = this.t('clickError', [selector]);
      this.window?.webContents.send('log-result', error);
      logger.error(`Erro ao clicar no elemento com seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async fill(
    selector: string,
    text: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<ExecutionResult> {
    const log = `Tentando preencher o texto ${text} no seletor ${selector} ...`;
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.locator(selector).fill(text);
      const log = `Sucesso ao preencher o texto ${text} no seletor ${selector}`;
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error = this.t('fillError', [text, selector]);
      this.window?.webContents.send('log-result', error);
      logger.error(`Erro ao preencher o texto ${text} no seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async type(
    selector: string,
    text: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<ExecutionResult> {
    const log = `Tentando digitar o texto ${text} no seletor ${selector} ...`;
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.type(selector, text);
      const log = `Sucesso ao digitar o texto ${text} no seletor ${selector}`;
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error = this.t('typeError', [text, selector]);
      this.window?.webContents.send('log-result', error);
      logger.error(`Erro ao digitar o texto ${text} no seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async clear(
    selector: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<ExecutionResult> {
    const log = `Tentando limpar o texto no seletor ${selector} ...`;
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.click(selector, { count: 3 });
      await this.page.keyboard.press('Backspace');
      const log = `Sucesso ao limpar o texto no seletor ${selector}`;
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error = this.t('clearError', [selector]);
      this.window?.webContents.send('log-result', error);
      logger.error(`Erro ao limpar o texto no seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async waitForVisible(
    selector: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<ExecutionResult> {
    const log = `Tentando aguardar elemento visível com seletor ${selector} ...`;
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.waitForSelector(selector, { visible: true });
      const log = `Sucesso ao esperar o seletor ${selector} visível`;
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error = this.t('waitVisibleError', [selector]);
      this.window?.webContents.send('log-result', error);
      logger.error(`Erro ao aguardar elemento visível com seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async waitForHidden(
    selector: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<ExecutionResult> {
    const log = `Tentando aguardar elemento oculto com seletor ${selector} ...`;
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.waitForSelector(selector, { hidden: true });
      const log = `Sucesso ao esperar o seletor ${selector} oculto`;
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error = this.t('waitHiddenError', [selector]);
      this.window?.webContents.send('log-result', error);
      logger.error(`Erro ao aguardar elemento oculto com seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async clickWaitForResponse(
    selector: string,
    urlPattern: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<ExecutionResult> {
    const log = `Tentando aguardar a resposta com a url ${urlPattern} ...`;
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      const regexPattern = new RegExp(urlPattern.replace(/\*\*/g, '.*?'));
      const finalResponsePromise = this.page.waitForResponse(response =>
        regexPattern.test(response.url())
      );
      await this.click(selector, id, saveScreenshot);
      const finalResponse = await finalResponsePromise;
      const log = `Sucesso aguardar a resposta com a url ${urlPattern}: ${finalResponse.ok()}`;
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error = this.t('clickWaitResponseError', [urlPattern]);
      this.window?.webContents.send('log-result', error);
      logger.error(`Erro ao aguardar a resposta com a url ${urlPattern}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async enter(id: string, saveScreenshot?: boolean): Promise<ExecutionResult> {
    const log = 'Tentando pressionar a tecla Enter ...';
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.keyboard.press('Enter');
      const log = 'Sucesso ao pressionar a tecla Enter';
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error = this.t('enterError');
      this.window?.webContents.send('log-result', error);
      logger.error(`Erro ao pressionar a tecla Enter: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async reload(id: string, saveScreenshot?: boolean): Promise<ExecutionResult> {
    const log = 'Tentando atualizar a página ...';
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      const log = 'Sucesso ao atualizar a página';
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error = this.t('reloadError');
      this.window?.webContents.send('log-result', error);
      logger.error(`Erro ao atualizar a página: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async select(
    selector: string,
    value: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<ExecutionResult> {
    const log = `Tentando aguardar elemento select com seletor ${selector} ...`;
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.select(selector, value);
      const log = `Sucesso ao esperar o seletor ${selector} com valor ${value}`;
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error = this.t('selectError', [selector, value]);
      this.window?.webContents.send('log-result', error);
      logger.info(`Erro ao esperar o seletor ${selector} com valor ${value}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async dragAndDrop(
    fromElement: string,
    toElement: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<ExecutionResult> {
    const log = `Tentando arrastar seletor com ${fromElement} e soltar com seletor ${toElement} ...`;
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.dragDrop(fromElement, toElement);
      const log = `Sucesso ao arrastar seletor com ${fromElement} e soltar com seletor ${toElement}`;
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error = this.t('dragAndDropError', [fromElement, toElement]);
      this.window?.webContents.send('log-result', error);
      logger.info(
        `Erro ao arrastar seletor com ${fromElement} e soltar com seletor ${toElement}: ${e}`
      );
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async iframeType(
    frameSelector: string,
    selector: string,
    text: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<ExecutionResult> {
    const log = `Tentando digitar ${text} no elemento ${selector} dentro do iframe ${frameSelector} ...`;
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.handleIframeType(frameSelector, selector, text);
      const log = `Sucesso ao digitar ${text} no elemento ${selector} dentro do iframe ${frameSelector}`;
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (e) {
      error = this.t('iframeTypeError', [frameSelector, selector, text]);
      this.window?.webContents.send('log-result', error);
      logger.error(
        `Erro ao digitar ${text} no elemento ${selector} dentro do iframe ${frameSelector}: ${e}`
      );
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async closeBrowser(): Promise<void> {
    const log = 'Tentando fechar o navegador ...';
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    try {
      await this.core.closeBrowser();
      const log = 'Sucesso ao fechar o navegador';
      this.window?.webContents.send('log-result', log);
      logger.info(log);
    } catch (error) {
      this.window?.webContents.send('log-result', error);
      logger.error(`Erro ao fechar o navegador ${error}`);
      throw new CoreError(`Erro ao fechar o navegador: ${error}`);
    }
  }

  public async sleep(ms: number): Promise<void> {
    logger.warn(`Tentando aguardar o tempo em ${ms} ms`);
    try {
      await new Promise(resolve => setTimeout(resolve, ms));
      logger.info('Sucesso ao aguardar o tempo');
    } catch (error) {
      logger.error(`Erro ao aguardar ${ms} milissegundos: ${error}`);
      throw new CoreError(`Erro ao aguardar ${ms} milissegundos: ${error}`);
    }
  }

  public async screenshot(name: string): Promise<string> {
    const log = `Tentando salvar tela de captura ${name} ...`;
    this.window?.webContents.send('log-result', log);
    logger.warn(log);
    try {
      const screenshotsDir = path.resolve(getDefaultDir(), 'screenshots');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      const screenshotPath = path.resolve(screenshotsDir, `${name}.png`);
      await this.page.screenshot({
        path: path.resolve(screenshotsDir, `${name}.png`),
      });
      const buffer = fs.readFileSync(screenshotPath);
      const base64Image = this.bufferToBase64(buffer);
      const log = `Sucesso ao salvar tela de captura ${name}`;
      this.window?.webContents.send('log-result', log);
      logger.info(log);
      return base64Image;
    } catch (error) {
      this.window?.webContents.send('log-result', error);
      logger.error(`Erro ao salvar tela de captura: ${error}`);
      throw new CoreError(`Erro ao salvar tela de captura: ${error}`);
    }
  }

  public async apiRequest(api: ApiDetail): Promise<void> {
    this.apiPage.page = await this.core.getPage();
    await this.apiPage.request(api);
  }

  private async saveScreenshot(id: string, saveScreenshot?: boolean): Promise<string | undefined> {
    if (saveScreenshot) {
      return await this.screenshot(id);
    }
  }

  private bufferToBase64(buffer: Buffer): string {
    return buffer.toString('base64');
  }

  private async dragDrop(fromElement: string, toElement: string): Promise<void> {
    const startElement = await this.findElement(fromElement);
    const targetElement = await this.findElement(toElement);
    if (!startElement || !targetElement) {
      throw new CoreError(
        `Não foi possível encontrar um dos elementos: ${fromElement}, ${toElement}`
      );
    }
    const startBoundingBox = await startElement.boundingBox();
    const targetBoundingBox = await targetElement.boundingBox();
    if (!startBoundingBox || !targetBoundingBox) {
      throw new CoreError('Não foi possível obter a caixa delimitadora dos elementos');
    }
    const startX = startBoundingBox.x + startBoundingBox.width / 2;
    const startY = startBoundingBox.y + startBoundingBox.height / 2;
    const endX = targetBoundingBox.x + targetBoundingBox.width / 2;
    const endY = targetBoundingBox.y + targetBoundingBox.height / 2;
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY, { steps: 10 });
    await this.page.mouse.up();
  }

  private async findElement(selector: string): Promise<ElementHandle<Element> | null> {
    try {
      return await this.page.$(selector);
    } catch (error) {
      throw new CoreError(`Erro ao encontrar elemento com seletor ${selector}: ${error}`);
    }
  }

  private async findFrame(selector: string): Promise<Frame | null> {
    const frameHandle = await this.findElement(selector);
    if (frameHandle) {
      const frame = await frameHandle.contentFrame();
      return frame;
    }
    return null;
  }

  private async handleIframeType(
    frameSelector: string,
    selector: string,
    text: string
  ): Promise<void> {
    const frame = await this.findFrame(frameSelector);
    if (frame) {
      const elementHandle = await frame.$(selector);
      if (elementHandle) {
        await elementHandle.type(text);
      } else {
        throw new CoreError(`Elemento ${selector} não encontrado no iframe`);
      }
    } else {
      throw new CoreError(`Iframe com seletor ${frameSelector} não encontrado`);
    }
  }
}
