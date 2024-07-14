import { Core } from '@puppeteer/core';
import { Page } from '@puppeteer/page';

(async () => {
  Core.setDefaultTimeout(5000);
  const page = new Page(Core.getInstance());
  await page.apiRequest({
    url: 'https://postman-echo.com/get',
    type: 'GET',
    contentType: 'application/json',
    expectStatusCode: 200,
  });
  await page.apiRequest({
    url: 'https://postman-echo.com/post',
    type: 'POST',
    contentType: 'application/json',
    data: {
      foo: 'FOO',
      bar: 'BAR',
    },
    expectStatusCode: 200,
  });
  await page.closeBrowser();
})();
