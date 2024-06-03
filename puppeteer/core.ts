import path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import { app } from 'electron';

export class Core {
  private constructor() {}

  private static instance: Core;
  private static headless = false;
  private static defaultTimeout = 15000;

  private page: Page | null = null;
  private browser: Browser | null = null;

  public static getInstance(): Core {
    if (!Core.instance) {
      Core.instance = new Core();
    }
    return Core.instance;
  }

  public static setHeadless(headless: boolean): void {
    this.headless = headless;
  }

  public static setDefaultTimeout(defaultTimeout: number): void {
    this.defaultTimeout = defaultTimeout;
  }

  public async getPage(): Promise<Page> {
    if (!this.page) {
      this.browser = await puppeteer.launch({
        executablePath: this.getExecutablePath(),
        headless: Core.headless,
        defaultViewport: null,
        args: ['--no-sandbox'],
      });
      this.page = await this.browser.newPage();
      const getPages = await this.browser.pages();
      await getPages[0].close();
      this.page.setDefaultTimeout(Core.defaultTimeout);
      await this.page.setViewport({ width: 1920, height: 1080 });
    }
    return this.page;
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  private getExecutablePath(): string {
    const resourcesPackaged =
      process.platform === 'linux'
        ? path.join(process.resourcesPath, 'resources', 'chrome-linux', 'chrome')
        : process.platform === 'win32'
        ? path.join(process.resourcesPath, 'resources', 'chrome-win', 'chrome.exe')
        : '';
    return app.isPackaged ? resourcesPackaged : (process.env.EXEC as string);
  }
}
