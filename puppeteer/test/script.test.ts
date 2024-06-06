import { Core } from '@puppeteer/core';
import { Page } from '@puppeteer/page';

(async () => {
  const page = new Page(Core.getInstance());
  await page.navigate('https://practice.expandtesting.com/inputs');
  await page.fill('#input-text', 'text', '');
  await page.navigate('https://practice.expandtesting.com/add-remove-elements');
  await page.click('xpath///button[@class="btn btn-primary mt-3"]', '');
  await page.sleep(2000);
  await page.closeBrowser();
})();
