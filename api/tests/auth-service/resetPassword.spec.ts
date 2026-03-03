import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import {
  BROKEN_TOKEN,
  INVALID_CHARACTERS_PASSWORD,
  INVALID_EMAIL,
} from '../../../core/constants/common';
import {
  APIErrorCodes,
  APIErrorMessages,
} from '../../../core/constants/errors';
import {
  expectResponsePropertyValue,
  expectResponseStatus,
  expectTokenNotToBeSame,
  expectValueToBeNull,
} from '../../../core/expectFunctions';
import { getResetPasswordTokenFromEmail } from '../../../core/getRegistrationCode';
import { UserFactory } from '../../../core/userFactory';
import { waitForSeconds } from '../../../e2e/utils/delay';
import { TestDataGenerator } from '../../utils/testDataGenerator';

test.describe(
  'Reset password API tests',
  { tag: '@auth-service' },
  async () => {
    test('Successful password reset flow with valid email', async ({
      request,
    }) => {
      await allure.suite('Reset password');
      await allure.layer('API');
      await allure.label('AS_ID', '2451');

      const { email, password } = await UserFactory.createUser(request);
      const newPassword = TestDataGenerator.generatePassword();

      const responseResetPassword = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: email },
        }
      );

      const token = await getResetPasswordTokenFromEmail(email);

      await expectResponseStatus(responseResetPassword, 200);

      const responseConfirmation = await request.post(
        '/api/v1/reset_password/confirm',
        {
          data: {
            password: newPassword,
            token: token,
          },
        }
      );

      await expectResponseStatus(responseConfirmation, 200);

      const responseFailedAuth = await request.post('/api/v1/auth', {
        data: { login: email, password: password },
      });

      await expectResponseStatus(responseFailedAuth, 401);

      const responseSuccessAuth = await request.post('/api/v1/auth', {
        data: { login: email, password: newPassword },
      });

      await expectResponseStatus(responseSuccessAuth, 200);
    });

    test('Repeated reset request with rate limit', async ({ request }) => {
      await allure.suite('Reset password');
      await allure.layer('API');
      await allure.label('AS_ID', '2448');

      const { email } = await UserFactory.createUser(request);

      const responseResetPassword1 = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: email },
        }
      );

      await expectResponseStatus(responseResetPassword1, 200);

      const responseResetPassword2 = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: email },
        }
      );

      await expectResponseStatus(responseResetPassword2, 400);
      const responseBody = await responseResetPassword2.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.TOO_MANY_REQUESTS
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.TOO_MANY_REQUESTS_ERROR
      );

      await waitForSeconds(3);

      const responseResetPassword3 = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: email },
        }
      );

      await expectResponseStatus(responseResetPassword3, 200);
    });

    test('Reset password returns unique tokens', async ({ request }) => {
      await allure.suite('Reset password');
      await allure.layer('API');
      await allure.label('AS_ID', '2440');

      const { email } = await UserFactory.createUser(request);

      const responseResetPassword1 = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: email },
        }
      );

      await expectResponseStatus(responseResetPassword1, 200);

      const token1 = await getResetPasswordTokenFromEmail(email);

      await waitForSeconds(3);

      const responseResetPassword2 = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: email },
        }
      );

      await expectResponseStatus(responseResetPassword2, 200);

      const token2 = await getResetPasswordTokenFromEmail(email);

      await expectTokenNotToBeSame(token1, token2);
    });

    test('Reset request to non-existent email', async ({ request }) => {
      await allure.suite('Reset password');
      await allure.layer('API');

      const email = TestDataGenerator.generateEmail();

      await request.post('/api/v1/reset_password', {
        data: { email: email },
      });

      const token = await getResetPasswordTokenFromEmail(email);

      await expectValueToBeNull(token, 'token');
    });

    test('Reset request with empty email', async ({ request }) => {
      await allure.suite('Reset password');
      await allure.layer('API');
      await allure.label('AS_ID', '2438');

      const responseResetPassword = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: '' },
        }
      );

      await expectResponseStatus(responseResetPassword, 400);
      const responseBody = await responseResetPassword.json();
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

    test('Reset request with invalid email format', async ({ request }) => {
      await allure.suite('Reset password');
      await allure.layer('API');
      await allure.label('AS_ID', '2443');

      const responseResetPassword = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: INVALID_EMAIL },
        }
      );

      await expectResponseStatus(responseResetPassword, 400);
      const responseBody = await responseResetPassword.json();
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

    test('Password reset confirmation with missing token', async ({
      request,
    }) => {
      await allure.suite('Reset password');
      await allure.layer('API');
      await allure.label('AS_ID', '2446');

      const newPassword = TestDataGenerator.generatePassword();

      const responseConfirmation = await request.post(
        '/api/v1/reset_password/confirm',
        {
          data: {
            password: newPassword,
            token: '',
          },
        }
      );

      await expectResponseStatus(responseConfirmation, 400);
      const responseBody = await responseConfirmation.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.REQUEST_VALIDATION_ERROR
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.TOKEN_FIELD_REQUIRED_ERROR
      );
    });

    test('Password reset confirmation with malformed token', async ({
      request,
    }) => {
      await allure.suite('Reset password');
      await allure.layer('API');
      await allure.label('AS_ID', '2447');

      const newPassword = TestDataGenerator.generatePassword();

      const responseConfirmation = await request.post(
        '/api/v1/reset_password/confirm',
        {
          data: {
            password: newPassword,
            token: BROKEN_TOKEN,
          },
        }
      );

      await expectResponseStatus(responseConfirmation, 400);
      const responseBody = await responseConfirmation.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.REQUEST_VALIDATION_ERROR
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.TOKEN_EXPIRED_ERROR
      );
    });

    test('Password reset confirmation with empty password', async ({
      request,
    }) => {
      await allure.suite('Reset password');
      await allure.layer('API');
      await allure.label('AS_ID', '2444');

      const { email } = await UserFactory.createUser(request);

      const responseResetPassword = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: email },
        }
      );

      const token = await getResetPasswordTokenFromEmail(email);

      await expectResponseStatus(responseResetPassword, 200);

      const responseConfirmation = await request.post(
        '/api/v1/reset_password/confirm',
        {
          data: {
            password: '',
            token: token,
          },
        }
      );

      await expectResponseStatus(responseConfirmation, 400);
      const responseBody = await responseConfirmation.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.REQUEST_VALIDATION_ERROR
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.NEW_PASSWORD_FILED_REQUIRED_ERROR
      );
    });

    test('Password reset confirmation with too short password', async ({
      request,
    }) => {
      await allure.suite('Reset password');
      await allure.layer('API');
      await allure.label('AS_ID', '2439');

      const { email } = await UserFactory.createUser(request);
      const newPassword = TestDataGenerator.generatePassword(1, 1);

      const responseResetPassword = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: email },
        }
      );

      const token = await getResetPasswordTokenFromEmail(email);

      await expectResponseStatus(responseResetPassword, 200);

      const responseConfirmation = await request.post(
        '/api/v1/reset_password/confirm',
        {
          data: {
            password: newPassword,
            token: token,
          },
        }
      );

      await expectResponseStatus(responseConfirmation, 400);
      const responseBody = await responseConfirmation.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.REQUEST_VALIDATION_ERROR
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.NEW_PASSWORD_MIN_SYMBOLS_ERROR
      );
    });

    test('Password reset confirmation with too long password', async ({
      request,
    }) => {
      await allure.suite('Reset password');
      await allure.layer('API');
      await allure.label('AS_ID', '2442');

      const { email } = await UserFactory.createUser(request);
      const newPassword = TestDataGenerator.generatePassword(21, 21);

      const responseResetPassword = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: email },
        }
      );

      const token = await getResetPasswordTokenFromEmail(email);

      await expectResponseStatus(responseResetPassword, 200);

      const responseConfirmation = await request.post(
        '/api/v1/reset_password/confirm',
        {
          data: {
            password: newPassword,
            token: token,
          },
        }
      );

      await expectResponseStatus(responseConfirmation, 400);
      const responseBody = await responseConfirmation.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.REQUEST_VALIDATION_ERROR
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.NEW_PASSWORD_MAX_SYMBOLS_ERROR
      );
    });

    test('Password reset confirmation with invalid characters', async ({
      request,
    }) => {
      await allure.suite('Reset password');
      await allure.layer('API');
      await allure.label('AS_ID', '2449');

      const { email } = await UserFactory.createUser(request);

      const responseResetPassword = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: email },
        }
      );

      const token = await getResetPasswordTokenFromEmail(email);

      await expectResponseStatus(responseResetPassword, 200);

      const responseConfirmation = await request.post(
        '/api/v1/reset_password/confirm',
        {
          data: {
            password: INVALID_CHARACTERS_PASSWORD,
            token: token,
          },
        }
      );

      await expectResponseStatus(responseConfirmation, 400);
      const responseBody = await responseConfirmation.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.REQUEST_VALIDATION_ERROR
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.NEW_PASSWORD_VALIDATION_ERROR
      );
    });

    test('Password reset confirmation using previous password', async ({
      request,
    }) => {
      await allure.suite('Reset password');
      await allure.layer('API');
      await allure.label('AS_ID', '2445');

      const { email, password } = await UserFactory.createUser(request);

      const responseResetPassword = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: email },
        }
      );

      const token = await getResetPasswordTokenFromEmail(email);

      await expectResponseStatus(responseResetPassword, 200);

      const responseConfirmation = await request.post(
        '/api/v1/reset_password/confirm',
        {
          data: {
            password: password,
            token: token,
          },
        }
      );

      await expectResponseStatus(responseConfirmation, 400);
      const responseBody = await responseConfirmation.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.REQUEST_VALIDATION_ERROR
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.NEW_PASSWORD_SAME_ERROR
      );
    });

    test('Password reset confirmation with reused token', async ({
      request,
    }) => {
      await allure.suite('Reset password');
      await allure.layer('API');
      await allure.label('AS_ID', '2441');

      const { email } = await UserFactory.createUser(request);
      const newPassword = TestDataGenerator.generatePassword();

      const responseResetPassword = await request.post(
        '/api/v1/reset_password',
        {
          data: { email: email },
        }
      );

      const token = await getResetPasswordTokenFromEmail(email);

      await expectResponseStatus(responseResetPassword, 200);

      const responseConfirmation = await request.post(
        '/api/v1/reset_password/confirm',
        {
          data: {
            password: newPassword,
            token: token,
          },
        }
      );

      await expectResponseStatus(responseConfirmation, 200);

      const responseConfirmation2 = await request.post(
        '/api/v1/reset_password/confirm',
        {
          data: {
            password: newPassword,
            token: token,
          },
        }
      );

      await expectResponseStatus(responseConfirmation2, 400);
      const responseBody = await responseConfirmation2.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.REQUEST_VALIDATION_ERROR
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.TOKEN_EXPIRED_ERROR
      );
    });
  }
);
