import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { TestDataGenerator } from '../../api/utils/testDataGenerator';
import { E2EErrors } from '../../core/constants/errors';
import {
  expectElementIsVisible,
  expectTextOnTheElement,
  expectToHaveURL,
} from '../../core/expectFunctions';
import { UserFactory } from '../../core/userFactory';
import { AuthorizationPage } from '../pages/authorizationPage';
import { SideNavigationMenuPage } from '../pages/menus/sideNavigationMenu';
import { TopMenuPage } from '../pages/menus/topMenu';

test.describe('Authorization E2E tests', async () => {
  test('Successful login with valid credentials', async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Authorization');
    await allure.layer('E2E');
    await allure.label('AS_ID', '1512');
    const { email, password } = await UserFactory.createUser(request);

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const sideNavigationMenuPage = SideNavigationMenuPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.fillLogin(email);
    await authorizationPage.fillPassword(password);
    await authorizationPage.clickLoginButton();

    await expectToHaveURL(page, `${process.env.BASE_URL_E2E}`);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);
    await expectElementIsVisible(topMenu.userAccountButton);
  });

  test('Login with incorrect password', async ({ request, page, browser }) => {
    await allure.suite('Authorization');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2003');
    const { email } = await UserFactory.createUser(request);
    const wrongPassword = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.fillLogin(email);
    await authorizationPage.fillPassword(wrongPassword);
    await authorizationPage.clickLoginButton();
    await authorizationPage.loginFormError.isVisible();
    await expectTextOnTheElement(
      authorizationPage.loginFormError,
      E2EErrors.NO_ACCOUNT_ERROR
    );
  });

  test('Login with password with spaces', async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Authorization');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2326');
    const { email, password } = await UserFactory.createUser(request);

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.fillLogin(email);
    await authorizationPage.fillPassword(password + ' ');
    await authorizationPage.clickLoginButton();
    await authorizationPage.loginFormError.isVisible();
    await expectTextOnTheElement(
      authorizationPage.loginFormError,
      E2EErrors.NO_ACCOUNT_ERROR
    );
  });

  test('Login with nonexistent email', async ({ request, page, browser }) => {
    await allure.suite('Authorization');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2324');
    const { password } = await UserFactory.createUser(request);
    const email_nonexistent = TestDataGenerator.generateEmail();

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.fillLogin(email_nonexistent);
    await authorizationPage.fillPassword(password);
    await authorizationPage.clickLoginButton();
    await authorizationPage.loginFormError.isVisible();
    await expectTextOnTheElement(
      authorizationPage.loginFormError,
      E2EErrors.NO_ACCOUNT_ERROR
    );
  });

  test('Login with email with spaces', async ({ request, page, browser }) => {
    await allure.suite('Authorization');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2325');
    const { email, password } = await UserFactory.createUser(request);

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const sideNavigationMenuPage = SideNavigationMenuPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.fillLogin(email + ' ');
    await authorizationPage.fillPassword(password);
    await authorizationPage.clickLoginButton();

    await expectToHaveURL(page, `${process.env.BASE_URL_E2E}`);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);
    await expectElementIsVisible(topMenu.userAccountButton);
  });
});
