import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BrowserContext } from 'playwright';

import { selector } from '../../utils/test-data-attribute';

export const CheckYourEmailModalPage = (
  page: Page,
  context: BrowserContext
) => {
  const okBtn = page.locator(selector('check-email-ok-submit'));
  const tryAnotherEmailBtn = page.locator(
    selector('check-email-send-another-email-button')
  );

  return {
    clickOkButton: async () => {
      await allure.step(`Click on the OK button`, async () => {
        await okBtn.click();
      });
    },
    clickTryAnotherEmailButton: async () => {
      await allure.step(`Click on the "Try another email" button`, async () => {
        await tryAnotherEmailBtn.click();
      });
    },
  };
};
