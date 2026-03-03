import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { TestDataGenerator } from '../../api/utils/testDataGenerator';
import { INVALID_CHARACTERS_PASSWORD } from '../../core/constants/common';
import { E2EErrors } from '../../core/constants/errors';
import {
  expectClassOnTheElement,
  expectElementIsVisible,
  expectTextOnTheElement,
  expectToHaveURL,
} from '../../core/expectFunctions';
import { UserFactory } from '../../core/userFactory';
import { AuthorizationPage } from '../pages/authorizationPage';
import { ChangePasswordModalPage } from '../pages/modals/changePasswordModal';
import { ConfirmationModalPage } from '../pages/modals/confirmationModal';
import { UserProfilePage } from '../pages/userProfilePage';
import { TopMenuPage } from '../pages/menus/topMenu';

//Tests were skipped because of change password functionality is not implemented for now.Unskip when it will be implemented.
test.describe.skip('Authorization E2E tests', async () => {
  test('Successful change password with valid credentials', async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Change password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2007');
    const { email, password } = await UserFactory.createUser(request);
    const newPassword = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const profilePage = UserProfilePage(page, context);
    const changePasswordPage = ChangePasswordModalPage(page, context);
    const confirmationModalPage = ConfirmationModalPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.fillLogin(email);
    await authorizationPage.fillPassword(password);
    await authorizationPage.clickLoginButton();
    await profilePage.clickChangePasswordButton();
    await changePasswordPage.fillOldPassword(password);
    await changePasswordPage.fillNewPassword(newPassword);
    await changePasswordPage.fillConfirmPassword(newPassword);
    await changePasswordPage.clickSubmitButton();
    await profilePage.clickLogoutButton();
    await confirmationModalPage.clickSubmitButton();
    await topMenu.clickSignInButton();
    await authorizationPage.fillLogin(email);
    await authorizationPage.fillPassword(password);
    await authorizationPage.clickLoginButton();
    await authorizationPage.loginFormError.isVisible();
    await expectTextOnTheElement(
      authorizationPage.loginFormError,
      E2EErrors.NO_ACCOUNT_ERROR
    );
    await authorizationPage.fillPassword(newPassword);
    await authorizationPage.clickLoginButton();
    await authorizationPage.loginFormError.isHidden();

    await expectToHaveURL(page, `${process.env.BASE_URL_E2E}`);
    await expectElementIsVisible(profilePage.profileBtn);
    await expectTextOnTheElement(profilePage.profileBtn, email);
  });

  test(`Change password with too short password`, async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Change password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2002');
    const { email, password } = await UserFactory.createUser(request);
    const newPassword = TestDataGenerator.generatePassword(1, 1);

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const profilePage = UserProfilePage(page, context);
    const changePasswordPage = ChangePasswordModalPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.fillLogin(email);
    await authorizationPage.fillPassword(password);
    await authorizationPage.clickLoginButton();
    await profilePage.clickChangePasswordButton();
    await changePasswordPage.fillOldPassword(password);
    await changePasswordPage.fillNewPassword(newPassword);
    await changePasswordPage.fillConfirmPassword(newPassword);
    await expectClassOnTheElement(changePasswordPage.submitBtn, /disabled/);
    await changePasswordPage.changePasswordMinLengthError.isVisible();
    await expectTextOnTheElement(
      changePasswordPage.changePasswordMinLengthError,
      E2EErrors.MIN_LENGTH_PASSWORD_ERROR
    );
  });

  test(`Change password with too long password`, async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Change password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2008');
    const { email, password } = await UserFactory.createUser(request);
    const newPassword = TestDataGenerator.generatePassword(21, 21);

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const profilePage = UserProfilePage(page, context);
    const changePasswordPage = ChangePasswordModalPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.fillLogin(email);
    await authorizationPage.fillPassword(password);
    await authorizationPage.clickLoginButton();
    await profilePage.clickChangePasswordButton();
    await changePasswordPage.fillOldPassword(password);
    await changePasswordPage.fillNewPassword(newPassword);
    await changePasswordPage.fillConfirmPassword(newPassword);
    await expectClassOnTheElement(changePasswordPage.submitBtn, /disabled/);
    await changePasswordPage.changePasswordMaxLengthError.isVisible();
    await expectTextOnTheElement(
      changePasswordPage.changePasswordMaxLengthError,
      E2EErrors.MAX_LENGTH_PASSWORD_ERROR
    );
  });

  test(`Change password with empty password`, async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Change password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2006');
    const { email, password } = await UserFactory.createUser(request);

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const profilePage = UserProfilePage(page, context);
    const changePasswordPage = ChangePasswordModalPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.fillLogin(email);
    await authorizationPage.fillPassword(password);
    await authorizationPage.clickLoginButton();
    await profilePage.clickChangePasswordButton();
    await changePasswordPage.fillOldPassword(password);
    await changePasswordPage.fillNewPassword('');
    await changePasswordPage.fillConfirmPassword('');
    await expectClassOnTheElement(changePasswordPage.submitBtn, /disabled/);
    await changePasswordPage.changePasswordEmptyError.isVisible();
    await expectTextOnTheElement(
      changePasswordPage.changePasswordEmptyError,
      E2EErrors.NEW_PASSWORD_REQUIRED_ERROR
    );
  });

  test(`Change password with the same password`, async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Change password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2403');
    const { email, password } = await UserFactory.createUser(request);

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const profilePage = UserProfilePage(page, context);
    const changePasswordPage = ChangePasswordModalPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.fillLogin(email);
    await authorizationPage.fillPassword(password);
    await authorizationPage.clickLoginButton();
    await profilePage.clickChangePasswordButton();
    await changePasswordPage.fillOldPassword(password);
    await changePasswordPage.fillNewPassword(password);
    await changePasswordPage.fillConfirmPassword(password);
    await expectClassOnTheElement(changePasswordPage.submitBtn, /disabled/);
    await changePasswordPage.changePasswordSameError.isVisible();
    await expectTextOnTheElement(
      changePasswordPage.changePasswordSameError,
      E2EErrors.SAME_PASSWORD_ERROR
    );
  });

  test(`Change password with wrong old password`, async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Change password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2404');
    const { email, password } = await UserFactory.createUser(request);
    const newPassword = TestDataGenerator.generatePassword();
    const fakeOldPassword = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const profilePage = UserProfilePage(page, context);
    const changePasswordPage = ChangePasswordModalPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.fillLogin(email);
    await authorizationPage.fillPassword(password);
    await authorizationPage.clickLoginButton();
    await profilePage.clickChangePasswordButton();
    await changePasswordPage.fillOldPassword(fakeOldPassword);
    await changePasswordPage.fillNewPassword(newPassword);
    await changePasswordPage.fillConfirmPassword(newPassword);
    await changePasswordPage.clickSubmitButton();
    await changePasswordPage.changePasswordServerError.isVisible();
    await expectTextOnTheElement(
      changePasswordPage.changePasswordServerError,
      E2EErrors.INCORRECT_OLD_PASSWORD_ERROR
    );
  });

  test(`Change password with invalid characters in password`, async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Change password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2402');
    const { email, password } = await UserFactory.createUser(request);

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const profilePage = UserProfilePage(page, context);
    const changePasswordPage = ChangePasswordModalPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.fillLogin(email);
    await authorizationPage.fillPassword(password);
    await authorizationPage.clickLoginButton();
    await profilePage.clickChangePasswordButton();
    await changePasswordPage.fillOldPassword(password);
    await changePasswordPage.fillNewPassword(INVALID_CHARACTERS_PASSWORD);
    await changePasswordPage.fillConfirmPassword(INVALID_CHARACTERS_PASSWORD);
    await expectClassOnTheElement(changePasswordPage.submitBtn, /disabled/);
    await changePasswordPage.changePasswordWrongSymbolsError.isVisible();
    await expectTextOnTheElement(
      changePasswordPage.changePasswordWrongSymbolsError,
      E2EErrors.WRONG_SYMBOLS_PASSWORD_ERROR
    );
  });
});
