import { test as base } from '@playwright/test';

import { getCurrentDate } from '../e2e/utils/dateTimeHelper';

export const test = base.extend({
  page: async ({ page, browserName }, use, testInfo) => {
    // tslint:disable-next-line:no-console
    console.log(`Running ${testInfo.title}`);

    await use(page);

    if (testInfo.status !== testInfo.expectedStatus) {
      // tslint:disable-next-line:no-console
      console.log(`Did not run as expected, ended up at ${page.url()}`);
    }

    if (testInfo.status !== 'passed') {
      await page.screenshot({
        path: `screenshots/${testInfo.title} ${getCurrentDate()} ${browserName}.png`,
        // tslint:disable-next-line:object-literal-sort-keys
        fullPage: true,
      });
    }
  },
});
