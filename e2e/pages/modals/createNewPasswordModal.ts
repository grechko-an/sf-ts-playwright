import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BrowserContext } from 'playwright';

import { selector } from '../../utils/test-data-attribute';
import { InputFieldPage } from '../inputFields/input-field-page';

export const CreateNewPasswordModalPage = (
  page: Page,
  context: BrowserContext
) => {
  const createNewPasswordTitle = page.locator(
    selector('create-password-form-title')
  );
  const password = new InputFieldPage(
    page,
    'changePassword-form-newPassword-field'
  );
  const confirmPassword = new InputFieldPage(
    page,
    'changePassword-form-confirmPassword-field'
  );
  const confirmPasswordBtn = page.locator(
    selector('change-password-form-submit-button')
  );
  const createPasswordServerError = page.locator(
    selector('change-password-server-error')
  );
  const createPasswordWrongSymbolsError = page.locator(
    selector('changePassword-form-newPassword-field-passwordStrength-error')
  );
  const createPasswordEmptyError = page.locator(
    selector('changePassword-form-newPassword-field-required-error')
  );
  const createPasswordMinLengthError = page.locator(
    selector('changePassword-form-newPassword-field-minlength-error')
  );
  const createPasswordMaxLengthError = page.locator(
    selector('changePassword-form-newPassword-field-maxlength-error')
  );
  const createPasswordDoNotMatchError = page.locator(
    selector('changePassword-form-confirmPassword-field-equalValue-error')
  );

  return {
    fillPassword: async (passwordValue: string) => {
      await allure.step(
        `Enter the password in the password field`,
        async () => {
          await password.setValue(passwordValue);
        }
      );
    },

    fillConfirmPassword: async (passwordValue: string) => {
      await allure.step(
        `Enter the password in the confirm password field`,
        async () => {
          await confirmPassword.setValue(passwordValue);
        }
      );
    },

    clickConfirmPasswordButton: async () => {
      await allure.step(`Click on the confirm password button`, async () => {
        await confirmPasswordBtn.click();
      });
    },
    createNewPasswordTitle,
    createPasswordServerError,
    createPasswordWrongSymbolsError,
    createPasswordEmptyError,
    createPasswordMinLengthError,
    createPasswordMaxLengthError,
    createPasswordDoNotMatchError,
    confirmPasswordBtn,
  };
};
