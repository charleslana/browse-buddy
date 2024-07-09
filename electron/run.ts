import translate from './translate';
import { Action } from './interfaces/action';
import { Core } from '../puppeteer/core';
import { generateUUID } from './utils/utils';
import { NavigationResult } from './interfaces/navigation-result';
import { Page } from '../puppeteer/page';
import { RunTest } from './interfaces/run-test';

const navigationResults: NavigationResult[] = [];
const page = new Page(Core.getInstance());

export async function run(jsonData: string): Promise<NavigationResult[]> {
  const runTest: RunTest = JSON.parse(jsonData);
  Core.setHeadless(runTest.isHeadless);
  Core.setDefaultTimeout(runTest.defaultTimeout);
  const repeatCount = runTest.repeat ?? 1;
  let result: NavigationResult[] = [];
  for (let i = 0; i < repeatCount; i++) {
    result = await runTestFunction(runTest);
    await page.closeBrowser();
  }
  navigationResults.length = 0;
  return result;
}

async function runTestFunction(runTest: RunTest): Promise<NavigationResult[]> {
  await navigate(runTest);
  await handleActions(runTest.actions, runTest.isSaveEveryScreenshot);
  await finish(runTest.isSaveLastScreenshot);
  const resultsToReturn = navigationResults.slice();
  return resultsToReturn;
}

async function navigate(runTest: RunTest): Promise<void> {
  await performNavigation(runTest.url, runTest.isSaveEveryScreenshot, runTest.contextUrl);
}

async function handleActions(actions: Action[], isSaveEveryScreenshot?: boolean): Promise<void> {
  for (const action of actions) {
    switch (action.type) {
      case 'wait-click':
        await handleWaitClick(action, isSaveEveryScreenshot);
        break;
      case 'click':
        await handleClick(action, isSaveEveryScreenshot);
        break;
      case 'fill':
        await handleFill(action, isSaveEveryScreenshot);
        break;
      case 'type':
        await handleType(action, isSaveEveryScreenshot);
        break;
      case 'clear':
        await handleClear(action, isSaveEveryScreenshot);
        break;
      case 'wait-visible':
        await handleWaitVisible(action, isSaveEveryScreenshot);
        break;
      case 'wait-hidden':
        await handleWaitHidden(action, isSaveEveryScreenshot);
        break;
      case 'click-wait-response':
        await handleClickWaitResponse(action, isSaveEveryScreenshot);
        break;
      case 'navigate':
        await handleNavigate(action, isSaveEveryScreenshot);
        break;
      case 'enter':
        await handleEnter(action, isSaveEveryScreenshot);
        break;
      case 'reload':
        await handleReload(action, isSaveEveryScreenshot);
        break;
      case 'select':
        await handleSelect(action, isSaveEveryScreenshot);
        break;
      case 'drag-and-drop':
        await handleDragAndDrop(action, isSaveEveryScreenshot);
        break;
      case 'iframe-type':
        await handleIframeType(action, isSaveEveryScreenshot);
        break;
      default:
        break;
    }
  }
}

async function handleWaitClick(action: Action, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = translate.global.t;
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await page.waitForClick(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'wait-click',
    title: t('actionWaitClick'),
    message: action.context ?? t('waitClickMessage', [element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleClick(action: Action, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = translate.global.t;
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await page.click(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'click',
    title: t('actionClick'),
    message: action.context ?? t('clickMessage', [element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleFill(action: Action, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = translate.global.t;
  const input = action.inputs[0];
  const secondInput = action.inputs[1];
  const element = `${input.select}${input.value}`;
  const executionResult = await page.fill(
    element,
    secondInput.value!,
    action.id,
    isSaveEveryScreenshot
  );
  navigationResults.push({
    action: 'fill',
    title: t('actionFill'),
    message: action.context ?? t('fillMessage', [secondInput.value, element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleType(action: Action, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = translate.global.t;
  const input = action.inputs[0];
  const secondInput = action.inputs[1];
  const element = `${input.select}${input.value}`;
  const executionResult = await page.type(
    element,
    secondInput.value!,
    action.id,
    isSaveEveryScreenshot
  );
  navigationResults.push({
    action: 'type',
    title: t('actionType'),
    message: action.context ?? t('typeMessage', [secondInput.value, element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleClear(action: Action, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = translate.global.t;
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await page.clear(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'clear',
    title: t('actionClear'),
    message: action.context ?? t('clearMessage', [element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleWaitVisible(action: Action, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = translate.global.t;
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await page.waitForVisible(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'wait-visible',
    title: t('actionWaitVisible'),
    message: action.context ?? t('waitVisibleMessage', [element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleWaitHidden(action: Action, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = translate.global.t;
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await page.waitForHidden(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'wait-hidden',
    title: t('actionWaitHidden'),
    message: action.context ?? t('waitHiddenMessage', [element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleClickWaitResponse(
  action: Action,
  isSaveEveryScreenshot?: boolean
): Promise<void> {
  const t = translate.global.t;
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const urlPattern = `${action.inputs[1].value}`;
  const executionResult = await page.clickWaitForResponse(
    element,
    urlPattern,
    action.id,
    isSaveEveryScreenshot
  );
  navigationResults.push({
    action: 'click-wait-response',
    title: t('actionClickWaitResponse'),
    message: action.context ?? t('clickWaitResponseMessage', [element, urlPattern]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleNavigate(action: Action, isSaveEveryScreenshot?: boolean): Promise<void> {
  const input = action.inputs[0];
  await performNavigation(input.value!, isSaveEveryScreenshot, action.context);
}

async function handleEnter(action: Action, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = translate.global.t;
  const executionResult = await page.enter(action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'enter',
    title: t('actionEnter'),
    message: action.context ?? t('actionEnter'),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleReload(action: Action, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = translate.global.t;
  const executionResult = await page.reload(action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'reload',
    title: t('actionReload'),
    message: action.context ?? t('actionReload'),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleSelect(action: Action, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = translate.global.t;
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const value = `${action.inputs[1].value}`;
  const executionResult = await page.select(element, value, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'select',
    title: t('actionSelect'),
    message: action.context ?? t('selectMessage', [element, value]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleDragAndDrop(action: Action, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = translate.global.t;
  const startInput = action.inputs[0];
  const targetInput = action.inputs[1];
  const fromElement = `${startInput.select}${startInput.value}`;
  const toElement = `${targetInput.select}${targetInput.value}`;
  const executionResult = await page.dragAndDrop(
    fromElement,
    toElement,
    action.id,
    isSaveEveryScreenshot
  );
  navigationResults.push({
    action: 'drag-and-drop',
    title: t('actionDragAndDrop'),
    message: action.context ?? t('dragAndDropMessage', [fromElement, toElement]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleIframeType(action: Action, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = translate.global.t;
  const frameSelector = action.inputs[0];
  const selector = action.inputs[1];
  const text = action.inputs[2];
  const frame = `${frameSelector.select}${frameSelector.value}`;
  const element = `${selector.select}${selector.value}`;
  const executionResult = await page.iframeType(
    frame,
    element,
    text.value!,
    action.id,
    isSaveEveryScreenshot
  );
  navigationResults.push({
    action: 'iframe-type',
    title: t('actionIframeType'),
    message: action.context ?? t('iframeTypeMessage', [frame, element, text.value]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function performNavigation(
  url: string,
  isSaveEveryScreenshot?: boolean,
  context?: string
): Promise<void> {
  const t = translate.global.t;
  const executionResult = await page.navigate(url, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'navigate',
    title: t('navigateTo'),
    message: context ?? t('navigateMessage', [url]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function finish(isSaveLastScreenshot: boolean): Promise<void> {
  const t = translate.global.t;
  let screenshot: string | undefined;
  if (isSaveLastScreenshot) {
    screenshot = await page.screenshot(generateUUID());
  }
  navigationResults.push({
    action: 'end',
    title: t('testCycleTitle'),
    message: t('testCycleMessage'),
    screenshot: screenshot,
  });
}
