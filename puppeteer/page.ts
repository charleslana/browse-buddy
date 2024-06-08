import fs from 'fs';
import logger from '../electron/utils/logger';
import path from 'path';
import translate from '../electron/translate';
import { Core } from './core';
import { CoreError } from './error';
import { ExecutionResult } from './interfaces/execution-result';
import { generateUUID } from '../electron/utils/utils';
import { Page as PuppeteerPage } from 'puppeteer';

export class Page {
  constructor(core: Core) {
    this.core = core;
  }

  private core: Core;
  private page: PuppeteerPage = <PuppeteerPage>{};
  private t = translate.global.t;

  async navigate(url: string, saveScreenshot?: boolean): Promise<ExecutionResult> {
    logger.warn(`Tentando navegar para ${url} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      this.page = await this.core.getPage();
      await this.page.goto(url, {
        waitUntil: 'domcontentloaded',
      });
      logger.info(`Sucesso ao navegar para ${url}`);
    } catch (e) {
      error = this.t('navigateError', [url]);
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
    logger.warn(`Tentando aguardar e clicar no elemento com seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      const result = await this.waitForVisible(selector, id, saveScreenshot);
      error = result.error;
      await this.page.click(selector);
      logger.info(`Sucesso ao aguardar e clicar no elemento com seletor ${selector}`);
    } catch (e) {
      error += this.t('waitForClickError', [selector]);
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
    logger.warn(`Tentando clicar no elemento com seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.click(selector);
      logger.info(`Sucesso ao clicar no elemento com seletor ${selector}`);
    } catch (e) {
      error = this.t('clickError', [selector]);
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
    logger.warn(`Tentando preencher o texto ${text} no seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.locator(selector).fill(text);
      logger.info(`Sucesso ao preencher o texto ${text} no seletor ${selector}`);
    } catch (e) {
      error = this.t('fillError', [text, selector]);
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
    logger.warn(`Tentando digitar o texto ${text} no seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.type(selector, text);
      logger.info(`Sucesso ao digitar o texto ${text} no seletor ${selector}`);
    } catch (e) {
      error = this.t('typeError', [text, selector]);
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
    logger.warn(`Tentando limpar o texto no seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.click(selector, { count: 3 });
      await this.page.keyboard.press('Backspace');
      logger.info(`Sucesso ao limpar o texto no seletor ${selector}`);
    } catch (e) {
      error = this.t('clearError', [selector]);
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
    logger.warn(`Tentando aguardar elemento visível com seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.waitForSelector(selector, { visible: true });
      logger.info(`Sucesso ao esperar o seletor ${selector} visível`);
    } catch (e) {
      error = this.t('waitVisibleError', [selector]);
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
    logger.warn(`Tentando aguardar elemento oculto com seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.waitForSelector(selector, { hidden: true });
      logger.info(`Sucesso ao esperar o seletor ${selector} oculto`);
    } catch (e) {
      error = this.t('waitHiddenError', [selector]);
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
    logger.warn(`Tentando aguardar a resposta com a url ${urlPattern} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      const regexPattern = new RegExp(urlPattern.replace(/\*\*/g, '.*?'));
      const finalResponsePromise = this.page.waitForResponse((response) =>
        regexPattern.test(response.url())
      );
      await this.click(selector, id, saveScreenshot);
      const finalResponse = await finalResponsePromise;
      logger.info(`Sucesso aguardar a resposta com a url ${urlPattern}: ${finalResponse.ok()}`);
    } catch (e) {
      error = this.t('clickWaitResponseError', [urlPattern]);
      logger.error(`Erro ao aguardar a resposta com a url ${urlPattern}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async enter(id: string, saveScreenshot?: boolean): Promise<ExecutionResult> {
    logger.warn('Tentando pressionar a tecla Enter ...');
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.keyboard.press('Enter');
      logger.info('Sucesso ao pressionar a tecla Enter');
    } catch (e) {
      error = this.t('enterError');
      logger.error(`Erro ao pressionar a tecla Enter: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async reload(id: string, saveScreenshot?: boolean): Promise<ExecutionResult> {
    logger.warn('Tentando atualizar a página ...');
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      logger.info('Sucesso ao atualizar a página');
    } catch (e) {
      error = this.t('reloadError');
      logger.error(`Erro ao atualizar a página: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async closeBrowser(): Promise<void> {
    logger.warn('Tentando fechar o navegador ...');
    try {
      await this.core.closeBrowser();
      logger.info('Sucesso ao fechar o navegador');
    } catch (error) {
      logger.error(`Erro ao fechar o navegador ${error}`);
      throw new CoreError(`Erro ao fechar o navegador: ${error}`);
    }
  }

  public async sleep(ms: number): Promise<void> {
    logger.warn(`Tentando aguardar o tempo em ${ms} ms`);
    try {
      await new Promise((resolve) => setTimeout(resolve, ms));
      logger.info('Sucesso ao aguardar o tempo');
    } catch (error) {
      logger.error(`Erro ao aguardar ${ms} milissegundos: ${error}`);
      throw new CoreError(`Erro ao aguardar ${ms} milissegundos: ${error}`);
    }
  }

  public async screenshot(name: string): Promise<string> {
    logger.warn(`Tentando salvar tela de captura ${name} ...`);
    try {
      const screenshotsDir = this.getScreenshotDir();
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      const screenshotPath = path.resolve(screenshotsDir, `${name}.png`);
      await this.page.screenshot({
        path: path.resolve(screenshotsDir, `${name}.png`),
      });
      const buffer = fs.readFileSync(screenshotPath);
      const base64Image = this.bufferToBase64(buffer);
      logger.info(`Sucesso ao salvar tela de captura ${name}`);
      return base64Image;
    } catch (error) {
      logger.error(`Erro ao salvar tela de captura: ${error}`);
      throw new CoreError(`Erro ao salvar tela de captura: ${error}`);
    }
  }

  private async saveScreenshot(id: string, saveScreenshot?: boolean): Promise<string | undefined> {
    if (saveScreenshot) {
      return await this.screenshot(id);
    }
  }

  private getScreenshotDir(): string {
    if (process.platform === 'linux') {
      return path.join(process.env.HOME || '', '.config', 'browse-buddy', 'screenshots');
    } else if (process.platform === 'win32') {
      return path.join(process.env.APPDATA || '', 'browse-buddy', 'screenshots');
    }
    throw new CoreError(`Sistema operacional não suportado: ${process.platform}`);
  }

  private bufferToBase64(buffer: Buffer): string {
    return buffer.toString('base64');
  }
}
