import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { TestDataGenerator } from '../../api/utils/testDataGenerator';
import {
  INVALID_CHARACTERS_PASSWORD,
  INVALID_EMAIL,
  TERMS_AND_CONDITIONS_MODAL_TITLE,
} from '../../core/constants/common';
import { E2EErrors } from '../../core/constants/errors';
import {
  expectCheckboxToBeChecked,
  expectElementIsHidden,
  expectElementIsVisible,
  expectElementToBeDisabled,
  expectTextOnTheElement,
} from '../../core/expectFunctions';
import { UserFactory } from '../../core/userFactory';
import { AuthorizationPage } from '../pages/authorizationPage';
import { RegistrationPage } from '../pages/registrationPage';
import { TermsAndConditionsModalPage } from '../pages/modals/termsAndConditionsModal';
import { TopMenuPage } from '../pages/menus/topMenu';
import { SideNavigationMenuPage } from '../pages/menus/sideNavigationMenu';

test.describe('Registration E2E tests', async () => {
  test('Successful registration with valid credentials', async ({
    page,
    browser,
  }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '1811');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const sideNavigationMenuPage = SideNavigationMenuPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword(password);
    await registrationPage.selectRandomCountry();
    await expectCheckboxToBeChecked(
      registrationPage.ageConfirmationCheckbox,
      'age confirmation'
    );
    await expectCheckboxToBeChecked(
      registrationPage.termsAgreementCheckbox,
      'terms agreement'
    );
    await registrationPage.clickRegistrationButton();

    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);
  });

  test('Registration with existing email with same password', async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2361');
    const { email, password } = await UserFactory.createUser(request);

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const sideNavigationMenuPage = SideNavigationMenuPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword(password);
    await registrationPage.selectRandomCountry();
    await registrationPage.clickRegistrationButton();

    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);
  });

  test('Registration with existing email with wrong password', async ({
    request,
    page,
    browser,
  }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2362');
    const { email } = await UserFactory.createUser(request);
    const password = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const authorizationPage = AuthorizationPage(page, context);
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword(password);
    await registrationPage.selectRandomCountry();
    await registrationPage.clickRegistrationButton();

    await expectElementIsVisible(authorizationPage.authorizationBtn);
  });

  test('Registration with a too short password', async ({ page, browser }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2360');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword(1, 1);

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword(password);
    await registrationPage.selectRandomCountry();

    await expectElementIsVisible(registrationPage.minLengthPasswordError);
    await expectTextOnTheElement(
      registrationPage.minLengthPasswordError,
      E2EErrors.MIN_LENGTH_PASSWORD_ERROR
    );
  });

  test('Registration with a too long password', async ({ page, browser }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2364');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword(21, 21);

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword(password);
    await registrationPage.selectRandomCountry();

    await expectElementIsVisible(registrationPage.maxLengthPasswordError);
    await expectTextOnTheElement(
      registrationPage.maxLengthPasswordError,
      E2EErrors.MAX_LENGTH_PASSWORD_ERROR
    );
  });

  test('Registration with empty password', async ({ page, browser }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2359');
    const email = TestDataGenerator.generateEmail();

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword('');
    await registrationPage.selectRandomCountry();

    await expectElementIsVisible(registrationPage.emptyPasswordError);
    await expectTextOnTheElement(
      registrationPage.emptyPasswordError,
      E2EErrors.EMPTY_PASSWORD_ERROR
    );
  });

  test('Registration with invalid characters in password', async ({
    page,
    browser,
  }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2363');
    const email = TestDataGenerator.generateEmail();

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword(INVALID_CHARACTERS_PASSWORD);
    await registrationPage.selectRandomCountry();

    await expectElementIsVisible(registrationPage.wrongSymbolsPasswordError);
    await expectTextOnTheElement(
      registrationPage.wrongSymbolsPasswordError,
      E2EErrors.WRONG_SYMBOLS_PASSWORD_ERROR
    );
  });

  test('Registration with empty email', async ({ page, browser }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2369');
    const password = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.fillEmail('');
    await registrationPage.fillPassword(password);
    await registrationPage.selectRandomCountry();

    await expectElementIsVisible(registrationPage.emptyEmailError);
    await expectTextOnTheElement(
      registrationPage.emptyEmailError,
      E2EErrors.EMPTY_EMAIL_ERROR
    );
  });

  test('Registration with invalid email format', async ({ page, browser }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2366');
    const password = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.fillEmail(INVALID_EMAIL);
    await registrationPage.fillPassword(password);
    await registrationPage.selectRandomCountry();

    await expectElementIsVisible(registrationPage.emailFormatError);
    await expectTextOnTheElement(
      registrationPage.emailFormatError,
      E2EErrors.EMAIL_FORMAT_ERROR
    );
  });

  test('Registration without age checkbox', async ({ page, browser }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2368');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword(password);
    await registrationPage.selectRandomCountry();
    await registrationPage.ageConfirmationCheckbox.uncheck();

    await expectElementToBeDisabled(
      registrationPage.registrationBtn,
      'registration button'
    );
  });

  test('Registration without terms and condition checkbox', async ({
    page,
    browser,
  }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2365');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword(password);
    await registrationPage.selectRandomCountry();
    await registrationPage.termsAgreementCheckbox.uncheck();

    await expectElementToBeDisabled(
      registrationPage.registrationBtn,
      'registration button'
    );
  });

  test('Registration without country', async ({ page, browser }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2405');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword(password);
    await registrationPage.countrySelect.click();
    await registrationPage.pass.click();

    await expectElementIsVisible(registrationPage.countryRequiredError);
    await expectTextOnTheElement(
      registrationPage.countryRequiredError,
      E2EErrors.COUNTRY_REQUIRED_ERROR
    );
  });

  test('Terms and conditions modal can be opened', async ({ page, browser }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2543');

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.clickTermsAndConditionsLink();

    const termsAndConditionsModal = TermsAndConditionsModalPage(page, context);

    await expectElementIsVisible(termsAndConditionsModal.textBlock);
    await expectTextOnTheElement(termsAndConditionsModal.title, TERMS_AND_CONDITIONS_MODAL_TITLE);
    await expectElementIsVisible(termsAndConditionsModal.scrolableContent);
  });

  test('Terms and conditions modal can be closed by clicking Close button', async ({ page, browser }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2544');

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.clickTermsAndConditionsLink();

    const termsAndConditionsModal = TermsAndConditionsModalPage(page, context);

    await termsAndConditionsModal.clickCloseButton();

    await expectElementIsHidden(termsAndConditionsModal.scrolableContent);
  });

  test('Terms and conditions modal can be closed by clicking outside it', async ({ page, browser }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2545');

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.clickTermsAndConditionsLink();

    const termsAndConditionsModal = TermsAndConditionsModalPage(page, context);

    await termsAndConditionsModal.clickOutside();

    await expectElementIsHidden(termsAndConditionsModal.scrolableContent);
  });

  test('Terms and conditions modal can re-opened', async ({ page, browser }) => {
    await allure.suite('Registration');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2546');

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const topMenu = TopMenuPage(page, context);

    await registrationPage.openPage('');
    await topMenu.clickSignUpButton();
    await registrationPage.clickTermsAndConditionsLink();

    const termsAndConditionsModal = TermsAndConditionsModalPage(page, context);

    await termsAndConditionsModal.clickCloseButton();
    await termsAndConditionsModal.scrolableContent.waitFor({ state: 'hidden' });
    await registrationPage.clickTermsAndConditionsLink();

    await expectElementIsVisible(termsAndConditionsModal.textBlock);
  });
  
});
