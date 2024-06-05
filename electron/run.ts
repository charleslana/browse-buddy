import { NavigationResult } from './interfaces/navigation-result';
// import { Core } from '../puppeteer/core';
// import { Page } from '../puppeteer/page';

export async function run(message: string): Promise<NavigationResult[]> {
  console.log(message);
  // const page = new Page(Core.getInstance());
  // await page.navigate('https://practice.expandtesting.com/');
  return [];
}
