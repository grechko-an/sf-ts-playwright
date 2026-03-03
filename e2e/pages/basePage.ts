import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';

export const openPage = async (page: Page, url: string): Promise<void> => {
  await allure.step(
    `Open page: ${process.env.BASE_URL_E2E}${url}`,
    async () => {
      await page.goto(`${process.env.BASE_URL_E2E}/${url}`);
    }
  );
};

export const refreshPage = async (page: Page): Promise<void> => {
  await allure.step('Reload page', async () => {
    await page.reload();
  });
};

export const waitForLoadState = async (
  page: Page,
  state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'
): Promise<void> => {
  await allure.step(`Page is waiting for state ${state}`, async () => {
    await page.waitForLoadState(state);
  });
};

export const getCurrentUrl = async (page: Page): Promise<string> => {
  return await allure.step(`Retrieving currently opened page URL`, async () =>
    page.url()
  );
};
