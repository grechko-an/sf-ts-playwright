import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { uuidv7 } from 'uuidv7';

import {
  APIErrorCodes,
  APIErrorMessages,
} from '../../../core/constants/errors';
import {
  expectResponseProperty,
  expectResponsePropertyValue,
  expectResponseStatus,
} from '../../../core/expectFunctions';
import { TestDataGenerator } from '../../utils/testDataGenerator';

test.describe('Authorization API tests', { tag: '@auth-service' }, async () => {
  test('Successful login with valid credentials', async ({ request }) => {
    await allure.suite('Authorization');
    await allure.layer('API');
    await allure.label('AS_ID', '1516');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();
    const uuid = uuidv7();
    await request.post('/api/internal/credentials_add', {
      data: { user_id: uuid, email: email, password: password },
    });
    const response = await request.post('/api/v1/auth', {
      data: { login: email, password: password },
    });

    await expectResponseStatus(response, 200);
    const responseBody = await response.json();
    await expectResponseProperty(responseBody, 'access_token');
  });

  test('Login with incorrect password', async ({ request }) => {
    await allure.suite('Authorization');
    await allure.layer('API');
    await allure.label('AS_ID', '1523');
    const email = TestDataGenerator.generateEmail();
    const password1 = TestDataGenerator.generatePassword();
    const password2 = TestDataGenerator.generatePassword();
    const uuid = uuidv7();
    await request.post('/api/internal/credentials_add', {
      data: { user_id: uuid, email: email, password: password1 },
    });
    const response = await request.post('/api/v1/auth', {
      data: { login: email, password: password2 },
    });

    await expectResponseStatus(response, 401);
    const responseBody = await response.json();
    await expectResponsePropertyValue(
      responseBody,
      'code',
      APIErrorCodes.UNAUTHORIZED_ERROR
    );
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.INVALID_CREDENTIALS_ERROR
    );
  });

  test('Login with password with spaces', async ({ request }) => {
    await allure.suite('Authorization');
    await allure.layer('API');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();
    const uuid = uuidv7();
    await request.post('/api/internal/credentials_add', {
      data: { user_id: uuid, email: email, password: password },
    });
    const response = await request.post('/api/v1/auth', {
      data: { login: email, password: password + ' ' },
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
      APIErrorMessages.PASSWORD_VALIDATION_ERROR
    );
  });

  test('Login with nonexistent email', async ({ request }) => {
    await allure.suite('Authorization');
    await allure.layer('API');
    await allure.label('AS_ID', '1520');
    const email1 = TestDataGenerator.generateEmail();
    const email2 = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();
    const uuid = uuidv7();
    await request.post('/api/internal/credentials_add', {
      data: { user_id: uuid, email: email1, password: password },
    });
    const response = await request.post('/api/v1/auth', {
      data: { login: email2, password: password },
    });

    await expectResponseStatus(response, 401);
    const responseBody = await response.json();
    await expectResponsePropertyValue(
      responseBody,
      'code',
      APIErrorCodes.UNAUTHORIZED_ERROR
    );
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.INVALID_CREDENTIALS_ERROR
    );
  });

  test('Login with email with spaces', async ({ request }) => {
    await allure.suite('Authorization');
    await allure.layer('API');
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();
    const uuid = uuidv7();
    await request.post('/api/internal/credentials_add', {
      data: { user_id: uuid, email: email, password: password },
    });
    const response = await request.post('/api/v1/auth', {
      data: { login: email + ' ', password: password },
    });

    await expectResponseStatus(response, 200);
    const responseBody = await response.json();
    await expectResponseProperty(responseBody, 'access_token');
  });
});
