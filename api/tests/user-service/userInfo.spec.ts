import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import {
  BROKEN_TOKEN,
  INVALID_SYMBOLS_USERNAME,
  INVALID_USERNAME,
} from '../../../core/constants/common';
import {
  APIErrorCodes,
  APIErrorMessages,
} from '../../../core/constants/errors';
import {
  expectResponseProperty,
  expectResponsePropertyValue,
  expectResponsePropertyWithValue,
  expectResponseStatus,
  expectResponseUsernameMatchesPattern,
} from '../../../core/expectFunctions';
import { UserFactory } from '../../../core/userFactory';
import { waitForSeconds } from '../../../e2e/utils/delay';
import { TestDataGenerator } from '../../utils/testDataGenerator';

test.describe('User info API tests', { tag: '@user-service' }, async () => {
  test('Successful getting info about user', async ({ request }) => {
    await allure.suite('Get user info');
    await allure.layer('API');
    await allure.label('AS_ID', '1672');
    const { token } = await UserFactory.createUser(request);
    const response = await request.get('/api/v1/user_info', {
      headers: { Authorization: `Bearer ${token}` },
    });
    await expectResponseStatus(response, 200);
    const responseBody = await response.json();
    await expectResponseProperty(responseBody, 'email');
    await expectResponseProperty(responseBody, 'username');
    await expectResponseProperty(responseBody, 'avatar');
    await expectResponseProperty(responseBody, 'personal_data');
    await expectResponseProperty(responseBody, 'registration_date');
    await expectResponseProperty(responseBody, 'status');
    await expectResponseUsernameMatchesPattern(responseBody.username);
  });

  test('Get info about user with broken token', async ({ request }) => {
    await allure.suite('Get user info');
    await allure.layer('API');
    await allure.label('AS_ID', '1673');
    const response = await request.get('/api/v1/user_info', {
      headers: { Authorization: `Bearer ${BROKEN_TOKEN}` },
    });
    await expectResponseStatus(response, 401);
  });

  test('Get info about user with expired token', async ({ request }) => {
    await allure.suite('Get user info');
    await allure.layer('API');
    await allure.label('AS_ID', '1706');
    const { token } = await UserFactory.createUser(request, 1, 1);
    await waitForSeconds(1);
    const response = await request.get('/api/v1/user_info', {
      headers: { Authorization: `Bearer ${token}` },
    });
    await expectResponseStatus(response, 401);
  });
});

test.describe(
  'Change user info API tests',
  { tag: '@user-service' },
  async () => {
    test('Successful username change to a valid value', async ({ request }) => {
      await allure.suite('Change user info');
      await allure.layer('API');
      await allure.label('AS_ID', '2535');

      const username = await TestDataGenerator.generateUsername();
      const { token } = await UserFactory.createUser(request);
      const response = await request.post('/api/v1/user_info', {
        headers: { Authorization: `Bearer ${token}` },
        data: { username: username },
      });
      await expectResponseStatus(response, 200);
      const responseBody = await response.json();
      await expectResponseProperty(responseBody, 'username');

      const response_get_username = await request.get('/api/v1/user_info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const responseBody_get_username = await response_get_username.json();
      await expectResponsePropertyWithValue(
        responseBody_get_username,
        'username',
        username
      );
    });

    test('Change username to a too short value', async ({ request }) => {
      await allure.suite('Change user info');
      await allure.layer('API');
      await allure.label('AS_ID', '2536');

      const username = await TestDataGenerator.generateUsername(1);
      const { token } = await UserFactory.createUser(request);
      const response = await request.post('/api/v1/user_info', {
        headers: { Authorization: `Bearer ${token}` },
        data: { username: username },
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
        APIErrorMessages.USERNAME_VALIDATION_ERROR
      );
    });

    test('Change username to a too long value', async ({ request }) => {
      await allure.suite('Change user info');
      await allure.layer('API');
      await allure.label('AS_ID', '2537');

      const username = await TestDataGenerator.generateUsername(17);
      const { token } = await UserFactory.createUser(request);
      const response = await request.post('/api/v1/user_info', {
        headers: { Authorization: `Bearer ${token}` },
        data: { username: username },
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
        APIErrorMessages.USERNAME_VALIDATION_ERROR
      );
    });

    test('Change username to an invalid name', async ({ request }) => {
      await allure.suite('Change user info');
      await allure.layer('API');
      await allure.label('AS_ID', '2538');

      const { token } = await UserFactory.createUser(request);
      const response = await request.post('/api/v1/user_info', {
        headers: { Authorization: `Bearer ${token}` },
        data: { username: INVALID_USERNAME },
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
        APIErrorMessages.USERNAME_VALIDATION_ERROR
      );
    });

    test('Change username to an invalid symbols in name', async ({
      request,
    }) => {
      await allure.suite('Change user info');
      await allure.layer('API');
      await allure.label('AS_ID', '2539');

      const { token } = await UserFactory.createUser(request);
      const response = await request.post('/api/v1/user_info', {
        headers: { Authorization: `Bearer ${token}` },
        data: { username: INVALID_SYMBOLS_USERNAME },
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
        APIErrorMessages.USERNAME_VALIDATION_ERROR
      );
    });

    test('Change username to an already existing one', async ({ request }) => {
      await allure.suite('Change user info');
      await allure.layer('API');
      await allure.label('AS_ID', '2540');

      const user1 = await UserFactory.createUser(request);
      const user2 = await UserFactory.createUser(request);
      const token1 = user1.token;
      const token2 = user2.token;
      const username = TestDataGenerator.generateUsername();

      const response = await request.post('/api/v1/user_info', {
        headers: { Authorization: `Bearer ${token1}` },
        data: { username: username },
      });
      await expectResponseStatus(response, 200);

      const response2 = await request.post('/api/v1/user_info', {
        headers: { Authorization: `Bearer ${token2}` },
        data: { username: username },
      });

      await expectResponseStatus(response2, 400);
      const responseBody = await response2.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.USERNAME_ALREADY_EXIST
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.USERNAME_ALREADY_EXIST_ERROR
      );
    });

    test('Change username more than 3 times', async ({ request }) => {
      await allure.suite('Change user info');
      await allure.layer('API');
      await allure.label('AS_ID', '2542');

      const { token } = await UserFactory.createUser(request);
      const username = TestDataGenerator.generateUsername();

      const response1 = await request.post('/api/v1/user_info', {
        headers: { Authorization: `Bearer ${token}` },
        data: { username: username },
      });
      await expectResponseStatus(response1, 200);

      const response2 = await request.post('/api/v1/user_info', {
        headers: { Authorization: `Bearer ${token}` },
        data: { username: username },
      });
      await expectResponseStatus(response2, 200);

      const response3 = await request.post('/api/v1/user_info', {
        headers: { Authorization: `Bearer ${token}` },
        data: { username: username },
      });
      await expectResponseStatus(response3, 200);

      const response4 = await request.post('/api/v1/user_info', {
        headers: { Authorization: `Bearer ${token}` },
        data: { username: username },
      });

      await expectResponseStatus(response4, 400);
      const responseBody = await response4.json();
      await expectResponsePropertyValue(
        responseBody,
        'code',
        APIErrorCodes.USERNAME_CHANGES_COUNT_EXCEEDED
      );
      await expectResponsePropertyValue(
        responseBody,
        'message',
        APIErrorMessages.USERNAME_CHANGE_ATTEMPTS_ERROR
      );
    });
  }
);
