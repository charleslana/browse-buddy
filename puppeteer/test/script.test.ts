import { Core } from '@puppeteer/core';
import { Page } from '@puppeteer/page';

(async () => {
  Core.setDefaultTimeout(5000);
  const page = new Page(Core.getInstance());
  await page.apiGet();
  await page.apiPost();
  await page.closeBrowser();
})();
