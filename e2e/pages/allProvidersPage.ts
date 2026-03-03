import { Page } from '@playwright/test';
import { BrowserContext } from 'playwright';

import { openPage, waitForLoadState } from './basePage';

export const AllProvidersPage = (page: Page, context: BrowserContext) => {
  const content = page.locator('app-providers-page');
  return {
    openPage: async (url: string) => openPage(page, url),

    waitForLoadState: async () => waitForLoadState(page, 'load'),

    content,
  };
};
