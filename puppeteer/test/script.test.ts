import { Core } from '@puppeteer/core';
import { Page } from '@puppeteer/page';

(async () => {
  const page = new Page(Core.getInstance());
  await page.navigate('https://practice.expandtesting.com/drag-and-drop');
  await page.dragAndDrop('#column-a', '#column-b', '');
  await page.sleep(2000);
  await page.navigate('https://practice.expandtesting.com/drag-and-drop-circles');
  await page.dragAndDrop('.red', '#target', '');
  await page.sleep(2000);
  await page.closeBrowser();
})();
