import { Core } from '@puppeteer/core';
import { Page } from '@puppeteer/page';

(async () => {
  const page = new Page(Core.getInstance());
  await page.navigate('https://practice.expandtesting.com/dropdown');
  await page.select('xpath///select[@id="dropdown"]', '2', '');
  await page.select('.form-control', '100', '');
  await page.select('#country', 'US', '');
  await page.sleep(2000);
  await page.closeBrowser();
})();
