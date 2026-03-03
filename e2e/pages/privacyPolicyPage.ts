import { Page } from '@playwright/test';
import { BrowserContext } from 'playwright';

import { openPage, waitForLoadState } from './basePage';

export const PrivacyPolicyPage = (page: Page, context: BrowserContext) => {
  const content = page.locator('app-privacy-policy-page');
  return {
    openPage: async (url: string) => openPage(page, url),

    waitForLoadState: async () => waitForLoadState(page, 'load'),

    content,
  };
};
