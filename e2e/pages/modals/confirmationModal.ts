import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BrowserContext } from 'playwright';

import { selector } from '../../utils/test-data-attribute';

export const ConfirmationModalPage = (page: Page, context: BrowserContext) => {
  const dialogCloseBtn = page.locator(selector('dialog-close-button'));
  const dialogAcceptBtn = page.locator(
    selector('confirm-dialog-confirm-button')
  );
  const dialogCancelBtn = page.locator(
    selector('confirm-dialog-cancel-button')
  );

  return {
    clickSubmitButton: async () => {
      await allure.step(`Click on the submit button`, async () => {
        await dialogAcceptBtn.click();
      });
    },

    clickCancelButton: async () => {
      await allure.step(`Click on the cancel button`, async () => {
        await dialogCancelBtn.click();
      });
    },

    clickCloseButton: async () => {
      await allure.step(`Click on the close button`, async () => {
        await dialogCloseBtn.click();
      });
    },
  };
};
