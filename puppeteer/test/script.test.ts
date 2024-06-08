import { Core } from '@puppeteer/core';
import { Page } from '@puppeteer/page';

(async () => {
  const page = new Page(Core.getInstance());
  await page.navigate('https://www.saucedemo.com/v1/');
  await page.fill('#user-name', 'user', '');
  await page.reload('');
  await page.sleep(2000);
  await page.closeBrowser();
})();
