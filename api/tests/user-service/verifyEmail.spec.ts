import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { INVALID_EMAIL } from '../../../core/constants/common';
import {
  APIErrorCodes,
  APIErrorMessages,
} from '../../../core/constants/errors';
import {
  expectResponsePropertyValue,
  expectResponseStatus,
  expectValueNotToBeNull,
  expectValueToBeNull,
} from '../../../core/expectFunctions';
import { getAuthCodeFromEmail } from '../../../core/getRegistrationCode';
import { TestDataGenerator } from '../../utils/testDataGenerator';

test.describe.serial(
  'Verify email API tests',
  { tag: '@user-service' },
  async () => {
    test.skip('Successful verification with valid email', async ({
      request,
    }) => {
      await allure.suite('Verify email');
      await allure.layer('API');
      await allure.label('AS_ID', '2149');
      const email = TestDataGenerator.generateEmail();
      const response = await request.post('/api/v1/verify_email', {
        data: { email: email },
      });

      await expectResponseStatus(response, 200);

      const code = await getAuthCodeFromEmail(email);

      await expectValueNotToBeNull(code, 'verification code');
    });

    test.skip('Verify account with invalid email', async ({ request }) => {
      await allure.suite('Verify email');
      await allure.layer('API');
      await allure.label('AS_ID', '2147');
      const response = await request.post('/api/v1/verify_email', {
        data: { email: INVALID_EMAIL },
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

      const code = await getAuthCodeFromEmail(INVALID_EMAIL);

      await expectValueToBeNull(code, 'verification code');
    });

    test.skip('Verify account with empty email', async ({ request }) => {
      await allure.suite('Verify email');
      await allure.layer('API');
      await allure.label('AS_ID', '2152');
      const response = await request.post('/api/v1/verify_email', {
        data: { email: '' },
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

    test.skip('Verify account with spaces in email', async ({ request }) => {
      await allure.suite('Verify email');
      await allure.layer('API');
      await allure.label('AS_ID', '2151');
      const email = TestDataGenerator.generateEmail();
      const response = await request.post('/api/v1/verify_email', {
        data: { email: ' ' + email },
      });

      await expectResponseStatus(response, 200);

      const code = await getAuthCodeFromEmail(email);

      await expectValueNotToBeNull(code, 'verification code');
    });

    test.skip('Verify account with long email', async ({ request }) => {
      await allure.suite('Verify email');
      await allure.layer('API');
      await allure.label('AS_ID', '2185');
      const email = TestDataGenerator.generateLongEmail();
      const response = await request.post('/api/v1/verify_email', {
        data: { email: email },
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
        APIErrorMessages.EMAIL_FIELD_MAX_SYMBOLS_ERROR
      );

      const code = await getAuthCodeFromEmail(email);

      await expectValueToBeNull(code, 'verification code');
    });

    test.skip('Verify account twice in a raw', async ({ request }) => {
      await allure.suite('Verify email');
      await allure.layer('API');
      await allure.label('AS_ID', '2150');
      const email = TestDataGenerator.generateEmail();
      const response1 = await request.post('/api/v1/verify_email', {
        data: { email: email },
      });

      await expectResponseStatus(response1, 200);
      const response2 = await request.post('/api/v1/verify_email', {
        data: { email: email },
      });
      await expectResponseStatus(response2, 400);
    });
  }
);
