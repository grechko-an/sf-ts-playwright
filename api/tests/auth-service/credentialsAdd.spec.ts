import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { uuidv7 } from 'uuidv7';

import {
  INVALID_CHARACTERS_PASSWORD,
  INVALID_EMAIL,
} from '../../../core/constants/common';
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

test.describe(
  'Add credentials API tests',
  { tag: '@auth-service' },
  async () => {
    test('Successful add credentials', async ({ request }) => {
      await allure.suite('Add credentials');
      await allure.layer('API');
      await allure.label('AS_ID', '1515');
      const email = TestDataGenerator.generateEmail();
      const password = TestDataGenerator.generatePassword();
      const uuid = uuidv7();
      const response = await request.post('/api/internal/credentials_add', {
        data: { user_id: uuid, email: email, password: password },
      });
      await expectResponseStatus(response, 200);
      const responseBody = await response.json();
      await expectResponseProperty(responseBody, 'status');
    });

    test('Add credentials with existing email', async ({ request }) => {
      await allure.suite('Add credentials');
      await allure.layer('API');
      await allure.label('AS_ID', '1507');
      const email = TestDataGenerator.generateEmail();
      const password = TestDataGenerator.generatePassword();
      const uuid = uuidv7();
      await request.post('/api/internal/credentials_add', {
        data: { user_id: uuid, email: email, password: password },
      });
      const response = await request.post('/api/internal/credentials_add', {
        data: { user_id: uuid, email: email, password: password },
      });

      await expectResponseStatus(response, 400);
      const responseBody = await response.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.ENTITY_ALREADY_EXISTS
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.CREDENTIALS_ALREADY_EXIST_ERROR
      );
    });

    test('Add credentials with invalid email format', async ({ request }) => {
      await allure.suite('Add credentials');
      await allure.layer('API');
      await allure.label('AS_ID', '1510');
      const password = TestDataGenerator.generatePassword();
      const uuid = uuidv7();
      const response = await request.post('/api/internal/credentials_add', {
        data: { user_id: uuid, email: INVALID_EMAIL, password: password },
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
        APIErrorMessages.EMAIL_VALIDATION_ERROR
      );
    });

    test('Add credentials with spaces in email', async ({ request }) => {
      await allure.suite('Add credentials');
      await allure.layer('API');
      const email = TestDataGenerator.generateEmail();
      const password = TestDataGenerator.generatePassword();
      const uuid = uuidv7();
      const response = await request.post('/api/internal/credentials_add', {
        data: { user_id: uuid, email: email + ' ', password: password },
      });

      await expectResponseStatus(response, 200);
      const responseBody = await response.json();
      await expectResponseProperty(responseBody, 'status');
    });

    test('Add credentials with spaces in password', async ({ request }) => {
      await allure.suite('Add credentials');
      await allure.layer('API');
      const email = TestDataGenerator.generateEmail();
      const password = TestDataGenerator.generatePassword(15, 15);
      const uuid = uuidv7();
      const response = await request.post('/api/internal/credentials_add', {
        data: { user_id: uuid, email: email, password: password + ' ' },
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

    test('Add credentials with a too short password', async ({ request }) => {
      await allure.suite('Add credentials');
      await allure.layer('API');
      await allure.label('AS_ID', '1529');
      const email = TestDataGenerator.generateEmail();
      const password = TestDataGenerator.generatePassword(1, 1);
      const uuid = uuidv7();
      const response = await request.post('/api/internal/credentials_add', {
        data: { user_id: uuid, email: email, password: password },
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
        APIErrorMessages.PASSWORD_MIN_SYMBOLS_ERROR
      );
    });

    test('Add credentials with a too long password', async ({ request }) => {
      await allure.suite('Add credentials');
      await allure.layer('API');
      await allure.label('AS_ID', '1526');
      const email = TestDataGenerator.generateEmail();
      const password = TestDataGenerator.generatePassword(21, 21);
      const uuid = uuidv7();
      const response = await request.post('/api/internal/credentials_add', {
        data: { user_id: uuid, email: email, password: password },
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
        APIErrorMessages.PASSWORD_MAX_SYMBOLS_ERROR
      );
    });

    test('Add credentials with empty email', async ({ request }) => {
      await allure.suite('Add credentials');
      await allure.layer('API');
      await allure.label('AS_ID', '1524');
      const password = TestDataGenerator.generatePassword();
      const uuid = uuidv7();
      const response = await request.post('/api/internal/credentials_add', {
        data: { user_id: uuid, email: '', password: password },
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
        APIErrorMessages.EMAIL_FIELD_REQUIRED_ERROR
      );
    });

    test('Add credentials with empty password', async ({ request }) => {
      await allure.suite('Add credentials');
      await allure.layer('API');
      await allure.label('AS_ID', '1522');
      const email = TestDataGenerator.generateEmail();
      const uuid = uuidv7();
      const response = await request.post('/api/internal/credentials_add', {
        data: { user_id: uuid, email: email, password: '' },
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
        APIErrorMessages.PASSWORD_FILED_REQUIRED_ERROR
      );
    });

    test('Add credentials with the same email but with different user_id', async ({
      request,
    }) => {
      await allure.suite('Add credentials');
      await allure.layer('API');
      await allure.label('AS_ID', '1562');
      const email = TestDataGenerator.generateEmail();
      const password = TestDataGenerator.generatePassword();
      const uuid1 = uuidv7();
      const uuid2 = uuidv7();
      const response = await request.post('/api/internal/credentials_add', {
        data: { user_id: uuid1, email: email, password: password },
      });
      await expectResponseStatus(response, 200);
      const response2 = await request.post('/api/internal/credentials_add', {
        data: { user_id: uuid2, email: email, password: password },
      });
      await expectResponseStatus(response2, 500);
      const responseBody = await response2.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.INTERNAL_ERROR
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.INTERNAL_SERVER_ERROR
      );
    });

    test('Add credentials with invalid characters in password', async ({
      request,
    }) => {
      await allure.suite('Add credentials');
      await allure.layer('API');
      await allure.label('AS_ID', '1511');
      const email = TestDataGenerator.generateEmail();
      const uuid = uuidv7();
      const response = await request.post('/api/internal/credentials_add', {
        data: {
          user_id: uuid,
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
        APIErrorMessages.PASSWORD_VALIDATION_ERROR
      );
    });
  }
);
