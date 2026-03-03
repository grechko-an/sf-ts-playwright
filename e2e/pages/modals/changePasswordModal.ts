import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BrowserContext } from 'playwright';

import { selector } from '../../utils/test-data-attribute';
import { InputFieldPage } from '../inputFields/input-field-page';

export const ChangePasswordModalPage = (
  page: Page,
  context: BrowserContext
) => {
  const oldPassword = new InputFieldPage(
    page,
    'changePassword-form-oldPassword-field'
  );
  const newPassword = new InputFieldPage(
    page,
    'changePassword-form-newPassword-field'
  );
  const confirmPassword = new InputFieldPage(
    page,
    'changePassword-form-confirmPassword-field'
  );
  const submitBtn = page.locator(
    selector('change-password-form-submit-button')
  );
  const changePasswordMinLengthError = page.locator(
    selector('changePassword-form-newPassword-field-minlength-error')
  );

  const changePasswordMaxLengthError = page.locator(
    selector('changePassword-form-newPassword-field-maxlength-error')
  );

  const changePasswordEmptyError = page.locator(
    selector('changePassword-form-newPassword-field-required-error')
  );

  const changePasswordSameError = page.locator(
    selector('changePassword-form-newPassword-field-newPasswordSameAsOld-error')
  );

  const changePasswordServerError = page.locator(
    selector('change-password-server-error')
  );

  const changePasswordWrongSymbolsError = page.locator(
    selector('changePassword-form-newPassword-field-passwordStrength-error')
  );

  return {
    fillOldPassword: async (loginValue: string) => {
      await allure.step(
        `Enter the old password in the old password field`,
        async () => {
          await oldPassword.setValue(loginValue);
        }
      );
    },

    fillNewPassword: async (password: string) => {
      await allure.step(
        `Enter the new password in the new password field`,
        async () => {
          await newPassword.setValue(password);
        }
      );
    },

    fillConfirmPassword: async (loginValue: string) => {
      await allure.step(
        `Enter the conformation of password in the confirm password field`,
        async () => {
          await confirmPassword.setValue(loginValue);
        }
      );
    },

    clickSubmitButton: async () => {
      await allure.step(`Click on the submit button`, async () => {
        await submitBtn.click();
      });
    },

    changePasswordMinLengthError,
    changePasswordMaxLengthError,
    changePasswordEmptyError,
    changePasswordSameError,
    changePasswordServerError,
    changePasswordWrongSymbolsError,
    submitBtn,
  };
};
