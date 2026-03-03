import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BrowserContext } from 'playwright';

import { selector } from '../../utils/test-data-attribute';
import { InputFieldPage } from '../inputFields/input-field-page';

export const ResetPasswordModalPage = (page: Page, context: BrowserContext) => {
  const resetPasswordModalTitle = page.locator(
    selector('reset-password-form-title')
  );
  const email = new InputFieldPage(page, 'resetPassword-form-email-field');
  const resetPasswordBtn = page.locator(selector('reset-password-form-submit'));
  const resetPasswordEmptyError = page.locator(
    selector('resetPassword-form-email-field-required-error')
  );
  const resetPasswordInvalidEmailError = page.locator(
    selector('resetPassword-form-email-field-email-error')
  );

  return {
    fillEmail: async (emailValue: string) => {
      await allure.step(`Enter the email in the email field`, async () => {
        await email.setValue(emailValue);
      });
    },

    clickResetPasswordButton: async () => {
      await allure.step(`Click on the reset password button`, async () => {
        await resetPasswordBtn.click();
      });
    },
    resetPasswordBtn,
    resetPasswordEmptyError,
    resetPasswordInvalidEmailError,
    resetPasswordModalTitle,
    email,
  };
};
