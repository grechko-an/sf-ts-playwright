import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import {
  BROKEN_TOKEN,
  INVALID_CHARACTERS_PASSWORD,
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
import { UserFactory } from '../../../core/userFactory';
import { waitForSeconds } from '../../../e2e/utils/delay';
import { TestDataGenerator } from '../../utils/testDataGenerator';

test.describe(
  'Password change API tests',
  { tag: '@auth-service' },
  async () => {
    test('Successful password change', async ({ request }) => {
      await allure.suite('Change password');
      await allure.layer('API');
      await allure.label('AS_ID', '1525');
      const { email, password, token } =
        await UserFactory.createCredentials(request);
      const newPassword = TestDataGenerator.generatePassword();
      const changePasswordResponse = await request.post(
        '/api/internal/password_change',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { old_password: password, new_password: newPassword },
        }
      );

      await expectResponseStatus(changePasswordResponse, 200);
      const responseBody = await changePasswordResponse.json();
      await expectResponseProperty(responseBody, 'status');

      const loginFailedResponse = await request.post('/api/v1/auth', {
        data: { login: email, password: password },
      });
      await expectResponseStatus(loginFailedResponse, 401);

      const loginNewPasswordResponse = await request.post('/api/v1/auth', {
        data: { login: email, password: newPassword },
      });
      await expectResponseStatus(loginNewPasswordResponse, 200);
    });

    test('Change password with a too short password', async ({ request }) => {
      await allure.suite('Change password');
      await allure.layer('API');
      await allure.label('AS_ID', '1527');
      const { password, token } = await UserFactory.createCredentials(request);
      const newPassword = TestDataGenerator.generatePassword(1, 1);
      const changePasswordResponse = await request.post(
        '/api/internal/password_change',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { old_password: password, new_password: newPassword },
        }
      );

      await expectResponseStatus(changePasswordResponse, 400);
      const responseBody = await changePasswordResponse.json();
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

    test('Change password with a too long password', async ({ request }) => {
      await allure.suite('Change password');
      await allure.layer('API');
      await allure.label('AS_ID', '1528');
      const { password, token } = await UserFactory.createCredentials(request);
      const newPassword = TestDataGenerator.generatePassword(21, 21);
      const changePasswordResponse = await request.post(
        '/api/internal/password_change',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { old_password: password, new_password: newPassword },
        }
      );

      await expectResponseStatus(changePasswordResponse, 400);
      const responseBody = await changePasswordResponse.json();
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

    test('Change password with empty password', async ({ request }) => {
      await allure.suite('Change password');
      await allure.layer('API');
      await allure.label('AS_ID', '1521');
      const { password, token } = await UserFactory.createCredentials(request);
      const newPassword = '';
      const changePasswordResponse = await request.post(
        '/api/internal/password_change',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { old_password: password, new_password: newPassword },
        }
      );

      await expectResponseStatus(changePasswordResponse, 400);
      const responseBody = await changePasswordResponse.json();
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

    test('Change password with the same password', async ({ request }) => {
      await allure.suite('Change password');
      await allure.layer('API');
      await allure.label('AS_ID', '1518');
      const { password, token } = await UserFactory.createCredentials(request);
      const changePasswordResponse = await request.post(
        '/api/internal/password_change',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { old_password: password, new_password: password },
        }
      );

      await expectResponseStatus(changePasswordResponse, 400);
      const responseBody = await changePasswordResponse.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.SAME_PASSWORD
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.NEW_PASSWORD_SAME_ERROR
      );
    });

    test('Change password with wrong old password', async ({ request }) => {
      await allure.suite('Change password');
      await allure.layer('API');
      await allure.label('AS_ID', '1844');
      const { token } = await UserFactory.createCredentials(request);
      const wrongPassword = TestDataGenerator.generatePassword();
      const newPassword = TestDataGenerator.generatePassword();
      const changePasswordResponse = await request.post(
        '/api/internal/password_change',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { old_password: wrongPassword, new_password: newPassword },
        }
      );

      await expectResponseStatus(changePasswordResponse, 401);
      const responseBody = await changePasswordResponse.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.OLD_PASSWORD_INVALID
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.OLD_PASSWORD_INVALID_ERROR
      );
    });

    test('Change password with invalid characters in password', async ({
      request,
    }) => {
      await allure.suite('Change password');
      await allure.layer('API');
      await allure.label('AS_ID', '1509');
      const { password, token } = await UserFactory.createCredentials(request);
      const changePasswordResponse = await request.post(
        '/api/internal/password_change',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: {
            old_password: password,
            new_password: INVALID_CHARACTERS_PASSWORD,
          },
        }
      );

      await expectResponseStatus(changePasswordResponse, 400);
      const responseBody = await changePasswordResponse.json();
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

    test('Change password with spaces in password', async ({ request }) => {
      await allure.suite('Change password');
      await allure.layer('API');
      const new_password = TestDataGenerator.generatePassword(15, 15);
      const { password, token } = await UserFactory.createCredentials(request);
      const changePasswordResponse = await request.post(
        '/api/internal/password_change',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: {
            old_password: password,
            new_password: new_password + ' ',
          },
        }
      );

      await expectResponseStatus(changePasswordResponse, 400);
      const responseBody = await changePasswordResponse.json();
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

    test('Change password with broken token', async ({ request }) => {
      await allure.suite('Change password');
      await allure.layer('API');
      await allure.label('AS_ID', '1563');
      const { password } = await UserFactory.createCredentials(request);
      const newPassword = TestDataGenerator.generatePassword();
      const changePasswordResponse = await request.post(
        '/api/internal/password_change',
        {
          headers: { Authorization: `Bearer ${BROKEN_TOKEN}` },
          data: { old_password: password, new_password: newPassword },
        }
      );

      await expectResponseStatus(changePasswordResponse, 401);
      const responseBody = await changePasswordResponse.json();
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.TOKEN_MALFORMED_ERROR
      );
    });

    test('Change password with expired token', async ({ request }) => {
      await allure.suite('Change password');
      await allure.layer('API');
      await allure.label('AS_ID', '1707');
      const { password, token } = await UserFactory.createCredentials(
        request,
        1,
        1
      );
      const newPassword = TestDataGenerator.generatePassword();
      await waitForSeconds(1);
      const changePasswordResponse = await request.post(
        '/api/internal/password_change',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { old_password: password, new_password: newPassword },
        }
      );

      await expectResponseStatus(changePasswordResponse, 401);
      const responseBody = await changePasswordResponse.json();
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.TOKEN_EXPIRED_2_ERROR
      );
    });
  }
);
