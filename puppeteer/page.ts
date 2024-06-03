import { Core } from './core';

export class Page {
  constructor(core: Core) {
    this.core = core;
  }

  private core: Core;

  async navigate(url: string) {
    const page = await this.core.getPage();
    await page.goto(url);
    await this.core.closeBrowser();
  }
}
