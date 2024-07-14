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
    saveScreenshot: true,
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
    saveScreenshot: true,
  });
  await page.apiRequest({
    url: 'https://reqres.in/api/users/2',
    type: 'PUT',
    contentType: 'application/json',
    data: {
      name: 'NAME',
      job: 'JOB',
    },
    expectStatusCode: 200,
    saveScreenshot: true,
  });
  await page.apiRequest({
    url: 'https://reqres.in/api/login',
    type: 'POST',
    contentType: 'application/json',
    data: {
      email: 'EMAIL',
    },
    expectStatusCode: 200,
    saveScreenshot: true,
  });
  await page.apiRequest({
    url: 'https://reqres.in/api/users/2',
    type: 'PATCH',
    contentType: 'application/json',
    data: {
      name: 'NAME',
      job: 'JOB',
    },
    expectStatusCode: 200,
    saveScreenshot: true,
  });
  await page.apiRequest({
    url: 'https://postman-echo.com/delete',
    type: 'DELETE',
    contentType: 'application/json',
    expectStatusCode: 200,
    saveScreenshot: true,
  });
  await page.closeBrowser();
})();
