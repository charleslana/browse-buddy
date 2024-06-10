import { Core } from '@puppeteer/core';
import { Page } from '@puppeteer/page';

(async () => {
  const page = new Page(Core.getInstance());
  await page.navigate('https://practice.expandtesting.com/iframe');
  await page.iframeType('#email-subscribe', '#email', 'email@email.com', '');
  await page.sleep(5000);
  await page.closeBrowser();
})();
