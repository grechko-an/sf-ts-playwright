import { Page } from '@playwright/test';
import { BrowserContext } from 'playwright';
import { openPage, waitForLoadState } from '../basePage';



export const Mobile_NavigationModalPage = (page: Page, context: BrowserContext) => {
  const content = page.locator('app-main-menu nav');
  return {
    content,
  };
};
