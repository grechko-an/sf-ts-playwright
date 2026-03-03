import { Page } from '@playwright/test';
import { BrowserContext } from 'playwright';

import { openPage, waitForLoadState } from './basePage';

export const TopGamesPage = (page: Page, context: BrowserContext) => {
  const content = page.locator('app-top-games-page');
  return {
    openPage: async (url: string) => openPage(page, url),

    waitForLoadState: async () => waitForLoadState(page, 'load'),

    content,
  };
};
