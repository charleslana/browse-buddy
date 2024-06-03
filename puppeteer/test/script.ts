import { Core } from 'puppeteer/core';
import { Page } from 'puppeteer/page';

(async () => {
  const page = new Page(Core.getInstance());
  await page.navigate('https://practice.expandtesting.com/');
})();
