import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BrowserContext } from 'playwright';

import { selector } from '../utils/test-data-attribute';
import { openPage } from './basePage';
import { InputFieldPage } from './inputFields/input-field-page';

export const AuthorizationPage = (page: Page, context: BrowserContext) => {
  const login = new InputFieldPage(page, 'login-form-email-field');
  const pass = new InputFieldPage(page, 'login-form-password-field');
  const authorizationBtn = page.locator(selector('login-form-submit')).last();
  const loginFormError = page.locator(selector('login-form-server-error'));
  const forgotPasswordBtn = page.locator(
    selector('login-form-forget-password-link')
  );
  const content = page.locator('lib-auth-login');

  return {
    openPage: async (url: string) => openPage(page, url),

    fillLogin: async (loginValue: string) => {
      await allure.step(`Enter the login in the login field`, async () => {
        await login.setValue(loginValue);
      });
    },

    fillPassword: async (password: string) => {
      await allure.step(
        `Enter the password in the password field`,
        async () => {
          await pass.setValue(password);
        }
      );
    },

    clickLoginButton: async () => {
      await allure.step(`Click on the login button`, async () => {
        await authorizationBtn.click();
      });
    },

    clickForgotPasswordButton: async () => {
      await allure.step(`Click on the forgot password button`, async () => {
        await forgotPasswordBtn.click();
      });
    },

    loginFormError,
    content,
    authorizationBtn,
  };
};
