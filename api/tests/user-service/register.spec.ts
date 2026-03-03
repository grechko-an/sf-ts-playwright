import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import {
  INVALID_CHARACTERS_PASSWORD,
  INVALID_EMAIL,
} from '../../../core/constants/common';
import {
  APIErrorCodes,
  APIErrorMessages,
} from '../../../core/constants/errors';
import { getRandomCountryAndCurrency } from '../../../core/countryAndCurrencyGenerator';
import {
  expectResponseProperty,
  expectResponsePropertyValue,
  expectResponseStatus,
} from '../../../core/expectFunctions';
import { TestDataGenerator } from '../../utils/testDataGenerator';

test.describe('Registration API tests', { tag: '@user-service' }, async () => {
  test('Successful registration of a user', async ({ request }) => {
    await allure.suite('Registration');
    await allure.layer('API');
    await allure.label('AS_ID', '1597');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();
    const { country, currency } = await getRandomCountryAndCurrency(request);

    const response = await request.post('/api/v1/register', {
      data: { country, currency, email: email, password: password },
    });
    await expectResponseStatus(response, 200);
    const responseBody = await response.json();
    await expectResponseProperty(responseBody, 'status');
    await expectResponseProperty(responseBody, 'message');
  });

  test('Registration with existing email', async ({ request }) => {
    await allure.suite('Registration');
    await allure.layer('API');
    await allure.label('AS_ID', '1598');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();
    const { country, currency } = await getRandomCountryAndCurrency(request);

    await request.post('/api/v1/register', {
      data: { country, currency, email: email, password: password },
    });
    const response = await request.post('/api/v1/register', {
      data: { country, currency, email: email, password: password },
    });

    await expectResponseStatus(response, 200);
    const responseBody = await response.json();
    await expectResponseProperty(responseBody, 'status');
    await expectResponseProperty(responseBody, 'message');
  });

  test('Registration with invalid email format', async ({ request }) => {
    await allure.suite('Registration');
    await allure.layer('API');
    await allure.label('AS_ID', '1599');
    const password = TestDataGenerator.generatePassword();
    const { country, currency } = await getRandomCountryAndCurrency(request);
    const response = await request.post('/api/v1/register', {
      data: { country, currency, email: INVALID_EMAIL, password: password },
    });

    await expectResponseStatus(response, 400);
    const responseBody = await response.json();
    await expectResponsePropertyValue(
      responseBody,
      'code',
      APIErrorCodes.REQUEST_VALIDATION_ERROR
    );
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.INVALID_REQUEST_ERROR
    );
  });

  test('Registration with a too short password', async ({ request }) => {
    await allure.suite('Registration');
    await allure.layer('API');
    await allure.label('AS_ID', '1603');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword(1, 1);
    const { country, currency } = await getRandomCountryAndCurrency(request);

    const response = await request.post('/api/v1/register', {
      data: { country, currency, email: email, password: password },
    });

    await expectResponseStatus(response, 400);
    const responseBody = await response.json();
    await expectResponsePropertyValue(
      responseBody,
      'code',
      APIErrorCodes.REQUEST_VALIDATION_ERROR
    );
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.INVALID_REQUEST_ERROR
    );
  });

  test('Registration with a too long password', async ({ request }) => {
    await allure.suite('Registration');
    await allure.layer('API');
    await allure.label('AS_ID', '1604');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword(21, 21);
    const { country, currency } = await getRandomCountryAndCurrency(request);

    const response = await request.post('/api/v1/register', {
      data: { country, currency, email: email, password: password },
    });

    await expectResponseStatus(response, 400);
    const responseBody = await response.json();
    await expectResponsePropertyValue(
      responseBody,
      'code',
      APIErrorCodes.REQUEST_VALIDATION_ERROR
    );
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.INVALID_REQUEST_ERROR
    );
  });

  test('Registration with empty email', async ({ request }) => {
    await allure.suite('Registration');
    await allure.layer('API');
    await allure.label('AS_ID', '1600');
    const password = TestDataGenerator.generatePassword();
    const { country, currency } = await getRandomCountryAndCurrency(request);
    const response = await request.post('/api/v1/register', {
      data: { country, currency, email: '', password: password },
    });

    await expectResponseStatus(response, 400);
    const responseBody = await response.json();
    await expectResponsePropertyValue(
      responseBody,
      'code',
      APIErrorCodes.REQUEST_VALIDATION_ERROR
    );
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.INVALID_REQUEST_ERROR
    );
  });

  test('Registration with empty password', async ({ request }) => {
    await allure.suite('Registration');
    await allure.layer('API');
    await allure.label('AS_ID', '1601');
    const email = TestDataGenerator.generateEmail();
    const { country, currency } = await getRandomCountryAndCurrency(request);

    const response = await request.post('/api/v1/register', {
      data: { country, currency, email: email, password: '' },
    });

    await expectResponseStatus(response, 400);
    const responseBody = await response.json();
    await expectResponsePropertyValue(
      responseBody,
      'code',
      APIErrorCodes.REQUEST_VALIDATION_ERROR
    );
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.INVALID_REQUEST_ERROR
    );
  });

  test('Registration with invalid characters in password', async ({
    request,
  }) => {
    await allure.suite('Registration');
    await allure.layer('API');
    await allure.label('AS_ID', '1602');
    const email = TestDataGenerator.generateEmail();
    const { country, currency } = await getRandomCountryAndCurrency(request);

    const response = await request.post('/api/v1/register', {
      data: {
        country,
        currency,
        email: email,
        password: INVALID_CHARACTERS_PASSWORD,
      },
    });

    await expectResponseStatus(response, 400);
    const responseBody = await response.json();
    await expectResponsePropertyValue(
      responseBody,
      'code',
      APIErrorCodes.REQUEST_VALIDATION_ERROR
    );
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.INVALID_REQUEST_ERROR
    );
  });

  test('Registration with empty country', async ({ request }) => {
    await allure.suite('Registration');
    await allure.layer('API');
    await allure.label('AS_ID', '2289');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();
    const { currency } = await getRandomCountryAndCurrency(request);
    const response = await request.post('/api/v1/register', {
      data: { country: '', currency, email: email, password: password },
    });

    await expectResponseStatus(response, 400);
    const responseBody = await response.json();
    await expectResponsePropertyValue(
      responseBody,
      'code',
      APIErrorCodes.REQUEST_VALIDATION_ERROR
    );
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.INVALID_REQUEST_ERROR
    );
  });

  test('Registration with empty currency', async ({ request }) => {
    await allure.suite('Registration');
    await allure.layer('API');
    await allure.label('AS_ID', '2291');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();
    const { country } = await getRandomCountryAndCurrency(request);
    const response = await request.post('/api/v1/register', {
      data: { country, currency: '', email: email, password: password },
    });

    await expectResponseStatus(response, 400);
    const responseBody = await response.json();
    await expectResponsePropertyValue(
      responseBody,
      'code',
      APIErrorCodes.REQUEST_VALIDATION_ERROR
    );
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.INVALID_REQUEST_ERROR
    );
  });

  test('Registration with invalid country', async ({ request }) => {
    await allure.suite('Registration');
    await allure.layer('API');
    await allure.label('AS_ID', '2288');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();
    const { currency } = await getRandomCountryAndCurrency(request);
    const response = await request.post('/api/v1/register', {
      data: { country: 'Test', currency, email: email, password: password },
    });

    await expectResponseStatus(response, 400);
    const responseBody = await response.json();
    await expectResponsePropertyValue(
      responseBody,
      'code',
      APIErrorCodes.REQUEST_VALIDATION_ERROR
    );
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.INVALID_REQUEST_ERROR
    );
  });

  test('Registration with invalid currency', async ({ request }) => {
    await allure.suite('Registration');
    await allure.layer('API');
    await allure.label('AS_ID', '2290');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();
    const { country } = await getRandomCountryAndCurrency(request);
    const response = await request.post('/api/v1/register', {
      data: { country, currency: 'Test', email: email, password: password },
    });

    await expectResponseStatus(response, 400);
    const responseBody = await response.json();
    await expectResponsePropertyValue(
      responseBody,
      'code',
      APIErrorCodes.REQUEST_VALIDATION_ERROR
    );
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.INVALID_REQUEST_ERROR
    );
  });
});
