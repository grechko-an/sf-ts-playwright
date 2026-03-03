import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { TestDataGenerator } from '../../api/utils/testDataGenerator';
import {
  INVALID_CHARACTERS_PASSWORD,
  INVALID_EMAIL,
} from '../../core/constants/common';
import { E2EErrors } from '../../core/constants/errors';
import {
  expectClassOnTheElement,
  expectElementIsVisible,
  expectTextOnTheElement,
  expectToHaveURL,
  expectValueToBeNull,
} from '../../core/expectFunctions';
import { getResetPasswordTokenFromEmail } from '../../core/getRegistrationCode';
import { UserFactory } from '../../core/userFactory';
import { AuthorizationPage } from '../pages/authorizationPage';
import { CheckYourEmailModalPage } from '../pages/modals/checkYourEmailModal';
import { CreateNewPasswordModalPage } from '../pages/modals/createNewPasswordModal';
import { ResetPasswordModalPage } from '../pages/modals/resetPasswordModal';
import { waitForSeconds } from '../utils/delay';
import { TopMenuPage } from '../pages/menus/topMenu';
import { SideNavigationMenuPage } from '../pages/menus/sideNavigationMenu';

test.describe('Reset password E2E tests', async () => {
  test('Successful reset password with valid credentials', async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Reset password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2494');

    const { email } = await UserFactory.createUser(request);
    const newPassword = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const resetPasswordModalPage = ResetPasswordModalPage(page, context);
    const checkYourEmailModalPage = CheckYourEmailModalPage(page, context);
    const createNewPasswordModalPage = CreateNewPasswordModalPage(
      page,
      context
    );
    const topMenu = TopMenuPage(page, context);
    const sideNavigationMenuPage = SideNavigationMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.clickForgotPasswordButton();
    await resetPasswordModalPage.fillEmail(email);
    await resetPasswordModalPage.clickResetPasswordButton();
    await checkYourEmailModalPage.clickOkButton();
    const token = await getResetPasswordTokenFromEmail(email);
    await authorizationPage.openPage(
      '' + '/reset-password?token=' + `${token}`
    );
    await createNewPasswordModalPage.fillPassword(newPassword);
    await createNewPasswordModalPage.fillConfirmPassword(newPassword);
    await createNewPasswordModalPage.clickConfirmPasswordButton();
    await authorizationPage.fillLogin(email);
    await authorizationPage.fillPassword(newPassword);
    await authorizationPage.clickLoginButton();

    await expectToHaveURL(page, `${process.env.BASE_URL_E2E}`);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);
  });

  test('Reset password with empty email', async ({ page, browser }) => {
    await allure.suite('Reset password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2496');

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const resetPasswordModalPage = ResetPasswordModalPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.clickForgotPasswordButton();
    await resetPasswordModalPage.email.click();
    await resetPasswordModalPage.resetPasswordModalTitle.click();
    await expectClassOnTheElement(
      resetPasswordModalPage.resetPasswordBtn,
      /disabled/
    );
    await resetPasswordModalPage.resetPasswordEmptyError.isVisible();
    await expectTextOnTheElement(
      resetPasswordModalPage.resetPasswordEmptyError,
      E2EErrors.EMPTY_EMAIL_ERROR
    );
  });

  test('Reset password with invalid email', async ({ page, browser }) => {
    await allure.suite('Reset password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2497');

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const resetPasswordModalPage = ResetPasswordModalPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.clickForgotPasswordButton();
    await resetPasswordModalPage.fillEmail(INVALID_EMAIL);
    await resetPasswordModalPage.resetPasswordModalTitle.click();
    await expectClassOnTheElement(
      resetPasswordModalPage.resetPasswordBtn,
      /disabled/
    );
    await resetPasswordModalPage.resetPasswordInvalidEmailError.isVisible();
    await expectTextOnTheElement(
      resetPasswordModalPage.resetPasswordInvalidEmailError,
      E2EErrors.EMAIL_FORMAT_ERROR
    );
  });

  test('Reset password with non-existent email', async ({ page, browser }) => {
    await allure.suite('Reset password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2491');

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const resetPasswordModalPage = ResetPasswordModalPage(page, context);
    const checkYourEmailModalPage = CheckYourEmailModalPage(page, context);
    const newEmail = await TestDataGenerator.generateEmail();
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.clickForgotPasswordButton();
    await resetPasswordModalPage.fillEmail(newEmail);
    await resetPasswordModalPage.clickResetPasswordButton();
    await checkYourEmailModalPage.clickOkButton();
    const token = await getResetPasswordTokenFromEmail(newEmail);

    await expectValueToBeNull(token, 'token');
  });

  test('Reset password and retry with different email', async ({
    page,
    browser,
  }) => {
    await allure.suite('Reset password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2490');

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const resetPasswordModalPage = ResetPasswordModalPage(page, context);
    const checkYourEmailModalPage = CheckYourEmailModalPage(page, context);
    const newEmail = await TestDataGenerator.generateEmail();
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.clickForgotPasswordButton();
    await resetPasswordModalPage.fillEmail(newEmail);
    await resetPasswordModalPage.clickResetPasswordButton();
    await checkYourEmailModalPage.clickTryAnotherEmailButton();

    await expectElementIsVisible(
      resetPasswordModalPage.resetPasswordModalTitle
    );
    await expectElementIsVisible(resetPasswordModalPage.resetPasswordBtn);
  });

  test('Reset password with reused token', async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Reset password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2501');

    const { email } = await UserFactory.createUser(request);
    const newPassword = TestDataGenerator.generatePassword();
    const newPassword2 = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const resetPasswordModalPage = ResetPasswordModalPage(page, context);
    const checkYourEmailModalPage = CheckYourEmailModalPage(page, context);
    const createNewPasswordModalPage = CreateNewPasswordModalPage(
      page,
      context
    );
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.clickForgotPasswordButton();
    await resetPasswordModalPage.fillEmail(email);
    await resetPasswordModalPage.clickResetPasswordButton();
    await checkYourEmailModalPage.clickOkButton();
    const token = await getResetPasswordTokenFromEmail(email);
    await authorizationPage.openPage(
      '' + '/reset-password?token=' + `${token}`
    );
    await createNewPasswordModalPage.fillPassword(newPassword);
    await createNewPasswordModalPage.fillConfirmPassword(newPassword);
    await createNewPasswordModalPage.clickConfirmPasswordButton();
    await waitForSeconds(1);
    await authorizationPage.openPage(
      '' + '/reset-password?token=' + `${token}`
    );
    await createNewPasswordModalPage.fillPassword(newPassword2);
    await createNewPasswordModalPage.fillConfirmPassword(newPassword2);
    await createNewPasswordModalPage.clickConfirmPasswordButton();
    await createNewPasswordModalPage.createPasswordServerError.isVisible();
    await expectTextOnTheElement(
      createNewPasswordModalPage.createPasswordServerError,
      E2EErrors.TOKEN_BAD_REQUEST
    );
  });

  test('Reset password with too short password', async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Reset password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2493');

    const { email } = await UserFactory.createUser(request);
    const newPassword = TestDataGenerator.generatePassword(1, 1);

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const resetPasswordModalPage = ResetPasswordModalPage(page, context);
    const checkYourEmailModalPage = CheckYourEmailModalPage(page, context);
    const createNewPasswordModalPage = CreateNewPasswordModalPage(
      page,
      context
    );
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.clickForgotPasswordButton();
    await resetPasswordModalPage.fillEmail(email);
    await resetPasswordModalPage.clickResetPasswordButton();
    await checkYourEmailModalPage.clickOkButton();
    const token = await getResetPasswordTokenFromEmail(email);
    await authorizationPage.openPage(
      '' + '/reset-password?token=' + `${token}`
    );
    await createNewPasswordModalPage.fillPassword(newPassword);
    await createNewPasswordModalPage.fillConfirmPassword(newPassword);
    await expectClassOnTheElement(
      createNewPasswordModalPage.confirmPasswordBtn,
      /disabled/
    );
    await createNewPasswordModalPage.createPasswordMinLengthError.isVisible();
    await expectTextOnTheElement(
      createNewPasswordModalPage.createPasswordMinLengthError,
      E2EErrors.MIN_LENGTH_PASSWORD_ERROR
    );
  });

  test('Reset password with too long password', async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Reset password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2500');

    const { email } = await UserFactory.createUser(request);
    const newPassword = TestDataGenerator.generatePassword(21, 21);

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const resetPasswordModalPage = ResetPasswordModalPage(page, context);
    const checkYourEmailModalPage = CheckYourEmailModalPage(page, context);
    const createNewPasswordModalPage = CreateNewPasswordModalPage(
      page,
      context
    );
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.clickForgotPasswordButton();
    await resetPasswordModalPage.fillEmail(email);
    await resetPasswordModalPage.clickResetPasswordButton();
    await checkYourEmailModalPage.clickOkButton();
    const token = await getResetPasswordTokenFromEmail(email);
    await authorizationPage.openPage(
      '' + '/reset-password?token=' + `${token}`
    );
    await createNewPasswordModalPage.fillPassword(newPassword);
    await createNewPasswordModalPage.fillConfirmPassword(newPassword);
    await expectClassOnTheElement(
      createNewPasswordModalPage.confirmPasswordBtn,
      /disabled/
    );
    await createNewPasswordModalPage.createPasswordMaxLengthError.isVisible();
    await expectTextOnTheElement(
      createNewPasswordModalPage.createPasswordMaxLengthError,
      E2EErrors.MAX_LENGTH_PASSWORD_ERROR
    );
  });

  test('Reset password with invalid characters in password', async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Reset password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2498');

    const { email } = await UserFactory.createUser(request);

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const resetPasswordModalPage = ResetPasswordModalPage(page, context);
    const checkYourEmailModalPage = CheckYourEmailModalPage(page, context);
    const createNewPasswordModalPage = CreateNewPasswordModalPage(
      page,
      context
    );
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.clickForgotPasswordButton();
    await resetPasswordModalPage.fillEmail(email);
    await resetPasswordModalPage.clickResetPasswordButton();
    await checkYourEmailModalPage.clickOkButton();
    const token = await getResetPasswordTokenFromEmail(email);
    await authorizationPage.openPage(
      '' + '/reset-password?token=' + `${token}`
    );
    await createNewPasswordModalPage.fillPassword(INVALID_CHARACTERS_PASSWORD);
    await createNewPasswordModalPage.fillConfirmPassword(
      INVALID_CHARACTERS_PASSWORD
    );
    await expectClassOnTheElement(
      createNewPasswordModalPage.confirmPasswordBtn,
      /disabled/
    );
    await createNewPasswordModalPage.createPasswordWrongSymbolsError.isVisible();
    await expectTextOnTheElement(
      createNewPasswordModalPage.createPasswordWrongSymbolsError,
      E2EErrors.WRONG_SYMBOLS_PASSWORD_ERROR
    );
  });

  test('Reset password with empty password', async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Reset password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2495');

    const { email } = await UserFactory.createUser(request);

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const resetPasswordModalPage = ResetPasswordModalPage(page, context);
    const checkYourEmailModalPage = CheckYourEmailModalPage(page, context);
    const createNewPasswordModalPage = CreateNewPasswordModalPage(
      page,
      context
    );
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.clickForgotPasswordButton();
    await resetPasswordModalPage.fillEmail(email);
    await resetPasswordModalPage.clickResetPasswordButton();
    await checkYourEmailModalPage.clickOkButton();
    const token = await getResetPasswordTokenFromEmail(email);
    await authorizationPage.openPage(
      '' + '/reset-password?token=' + `${token}`
    );
    await createNewPasswordModalPage.fillPassword('');
    await createNewPasswordModalPage.fillConfirmPassword('');
    await expectClassOnTheElement(
      createNewPasswordModalPage.confirmPasswordBtn,
      /disabled/
    );
    await createNewPasswordModalPage.createPasswordEmptyError.isVisible();
    await expectTextOnTheElement(
      createNewPasswordModalPage.createPasswordEmptyError,
      E2EErrors.NEW_PASSWORD_REQUIRED_ERROR
    );
  });

  test('Reset password with mismatched passwords', async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Reset password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2499');

    const { email } = await UserFactory.createUser(request);
    const newPassword = TestDataGenerator.generatePassword();
    const newPassword2 = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const resetPasswordModalPage = ResetPasswordModalPage(page, context);
    const checkYourEmailModalPage = CheckYourEmailModalPage(page, context);
    const createNewPasswordModalPage = CreateNewPasswordModalPage(
      page,
      context
    );
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.clickForgotPasswordButton();
    await resetPasswordModalPage.fillEmail(email);
    await resetPasswordModalPage.clickResetPasswordButton();
    await checkYourEmailModalPage.clickOkButton();
    const token = await getResetPasswordTokenFromEmail(email);
    await authorizationPage.openPage(
      '' + '/reset-password?token=' + `${token}`
    );
    await createNewPasswordModalPage.fillPassword(newPassword);
    await createNewPasswordModalPage.fillConfirmPassword(newPassword2);
    await createNewPasswordModalPage.createNewPasswordTitle.click();
    await expectClassOnTheElement(
      createNewPasswordModalPage.confirmPasswordBtn,
      /disabled/
    );
    await createNewPasswordModalPage.createPasswordDoNotMatchError.isVisible();
    await expectTextOnTheElement(
      createNewPasswordModalPage.createPasswordDoNotMatchError,
      E2EErrors.PASSWORD_DO_NOT_MATCH_ERROR
    );
  });

  test('Reset password with previously used passwords', async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Reset password');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2492');

    const { email, password } = await UserFactory.createUser(request);

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const resetPasswordModalPage = ResetPasswordModalPage(page, context);
    const checkYourEmailModalPage = CheckYourEmailModalPage(page, context);
    const createNewPasswordModalPage = CreateNewPasswordModalPage(
      page,
      context
    );
    const topMenu = TopMenuPage(page, context);

    await authorizationPage.openPage('');
    await topMenu.clickSignInButton();
    await authorizationPage.clickForgotPasswordButton();
    await resetPasswordModalPage.fillEmail(email);
    await resetPasswordModalPage.clickResetPasswordButton();
    await checkYourEmailModalPage.clickOkButton();
    const token = await getResetPasswordTokenFromEmail(email);
    await authorizationPage.openPage(
      '' + '/reset-password?token=' + `${token}`
    );
    await createNewPasswordModalPage.fillPassword(password);
    await createNewPasswordModalPage.fillConfirmPassword(password);
    await createNewPasswordModalPage.clickConfirmPasswordButton();

    await createNewPasswordModalPage.createPasswordServerError.isVisible();
    await expectTextOnTheElement(
      createNewPasswordModalPage.createPasswordServerError,
      E2EErrors.CHANGE_PASSWORD_THE_SAME_PASSWORD
    );
  });

});
