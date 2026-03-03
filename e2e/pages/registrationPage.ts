import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BrowserContext } from 'playwright';

import { waitForSeconds } from '../utils/delay';
import { selector } from '../utils/test-data-attribute';
import { openPage } from './basePage';
import { InputFieldPage } from './inputFields/input-field-page';

export const RegistrationPage = (page: Page, context: BrowserContext) => {
  const email = new InputFieldPage(page, 'registration-form-email-field');
  const pass = new InputFieldPage(page, 'registration-form-password-field');
  const content = page.locator('lib-auth-registration');
  const countrySelect = new InputFieldPage(
    page,
    'registration-form-country-field'
  );
  const currencySelect = new InputFieldPage(
    page,
    'registration-form-currency-field'
  );
  const ageConfirmationCheckbox = page.locator(
    selector('registration-form-ageConfirm-checkbox')
  );
  const termsAgreementCheckbox = page.locator(
    selector('registration-form-readRules-checkbox')
  );
  const registrationBtn = page.locator(selector('registration-form-submit'));
  const signUpBtn = page.locator(selector('registration-button'));

  const maxLengthPasswordError = page.locator(
    selector('registration-form-password-field-maxlength-error')
  );

  const minLengthPasswordError = page.locator(
    selector('registration-form-password-field-minlength-error')
  );

  const emptyEmailError = page.locator(
    selector('registration-form-email-field-required-error')
  );

  const emptyPasswordError = page.locator(
    selector('registration-form-password-field-required-error')
  );

  const wrongSymbolsPasswordError = page.locator(
    selector('registration-form-password-field-passwordStrength-error')
  );

  const emailFormatError = page.locator(
    selector('registration-form-email-field-email-error')
  );

  const countryRequiredError = page.locator(
    selector('registration-form-country-field-required-error')
  );

  const termsAndConditionsLink = content.locator(selector('link-terms'));

  return {
    openPage: async (url: string) => openPage(page, url),

    fillEmail: async (emailValue: string) => {
      await allure.step(`Enter the email in the email field`, async () => {
        await email.setValue(emailValue);
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

    async selectRandomCountry() {
      await allure.step(`Choose country on the registration page`, async () => {
        await countrySelect.click();
        await waitForSeconds(1);

        const countryOptions = page.locator('ul.form-control__dropdown > li');

        const count = await countryOptions.count();
        if (count === 0) {
          throw new Error('No country options available in the select');
        }

        const randomIndex = Math.floor(Math.random() * count);
        const randomCountry = await countryOptions.nth(randomIndex);

        const countryText = await randomCountry.textContent();

        if (!countryText) {
          throw new Error('Randomly selected option has no value');
        }

        await randomCountry.click();
      });
    },

    async selectRandomCurrency() {
      await allure.step(
        `Choose currency on the registration page`,
        async () => {
          await currencySelect.click();
          await waitForSeconds(1);

          const currencyOptions = page.locator(
            'ul.form-control__dropdown > li'
          );

          const count = await currencyOptions.count();
          if (count === 0) {
            throw new Error('No currency options available in the select');
          }

          const randomIndex = Math.floor(Math.random() * count);
          const randomCurrency = currencyOptions.nth(randomIndex);
          const currencyText = await randomCurrency.textContent();

          if (!currencyText) {
            throw new Error('Randomly selected option has no value');
          }

          await randomCurrency.click();
        }
      );
    },

    clickRegistrationButton: async () => {
      await allure.step(`Click on the registration button`, async () => {
        await registrationBtn.click();
      });
      await waitForSeconds(1);
    },

    clickTermsAndConditionsLink: async () => {
      await allure.step(`Click on the Terms and Conditions link`, async () => {
        await termsAndConditionsLink.click();
      });
    },

    signUpBtn,
    ageConfirmationCheckbox,
    termsAgreementCheckbox,
    maxLengthPasswordError,
    minLengthPasswordError,
    emptyEmailError,
    emptyPasswordError,
    wrongSymbolsPasswordError,
    emailFormatError,
    countryRequiredError,
    registrationBtn,
    countrySelect,
    pass,
    termsAndConditionsLink,
  };
};
