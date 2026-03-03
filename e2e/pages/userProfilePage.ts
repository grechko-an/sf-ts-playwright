import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BrowserContext } from 'playwright';

import { selector } from '../utils/test-data-attribute';
import { openPage } from './basePage';

export const UserProfilePage = (page: Page, context: BrowserContext) => {
  const main = page.locator('app-user-account-page');
  const profileBtn = page.locator(selector('logout-button'));
  const changePasswordBtn = page.locator(
    selector('accountMenu-openChangePasswordModal')
  );
  const logoutBtn = page.locator(selector('accountMenu-openLogoutModal'));
  const securityTabButton = page.getByText('Security');
  const limitsTabButton = page.getByText('Limits');
  const depositLimitsSwitch = page.locator('app-security-card').filter({ hasText: 'Deposit Limits' });

  return {
    openPage: async () => {
      await allure.step(`Open Profile page`, async () => {
        await openPage(page, 'account');
      });
    },

    clickChangePasswordButton: async () => {
      await allure.step(`Click on the change password button`, async () => {
        await profileBtn.click();
        await changePasswordBtn.click();
      });
    },

    clickLogoutButton: async () => {
      await allure.step(`Click on the logout button`, async () => {
        await profileBtn.click();
        await logoutBtn.click();
      });
    },

    clickSecurityTabButton: async () => {
      await allure.step(`Click on the Security tab button`, async () => {
        await securityTabButton.click();
      });
    },

    clickLimitsTabButton: async () => {
      await allure.step(`Click on the Limits tab button`, async () => {
        await limitsTabButton.click();
      });
    },

    clickDepositLimitsSwitch: async () => {
      await allure.step(`Click on the Deposit Limits switch`, async () => {
        await depositLimitsSwitch.click();
      });
    },

    main,
    logoutBtn,
    profileBtn,
  };
};
