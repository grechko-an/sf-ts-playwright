import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { BROKEN_TOKEN } from '../../../core/constants/common';
import { APIErrorMessages } from '../../../core/constants/errors';
import {
  expectResponsePropertyValue,
  expectResponseStatus,
  expectValueToBeUndefined,
} from '../../../core/expectFunctions';
import { UserFactory } from '../../../core/userFactory';
import { waitForSeconds } from '../../../e2e/utils/delay';

test.describe('Logout API tests', { tag: '@auth-service' }, async () => {
  test('Successful logout', async ({ request }) => {
    await allure.suite('Logout');
    await allure.layer('API');
    await allure.label('AS_ID', '1879');
    const { token } = await UserFactory.createUser(request);
    const response = await request.post('/api/v1/logout', {
      headers: { Authorization: `Bearer ${token}` },
    });
    await expectResponseStatus(response, 200);
    const cookies = await request.storageState();
    const refreshTokenCookie = cookies.cookies.find(
      (cookie) => cookie.name === 'refresh_token'
    );
    await expectValueToBeUndefined(refreshTokenCookie, 'refresh_token');
  });

  test('Logout with broken token', async ({ request }) => {
    await allure.suite('Logout');
    await allure.layer('API');
    await allure.label('AS_ID', '1878');
    const response = await request.post('/api/v1/logout', {
      headers: { Authorization: `Bearer ${BROKEN_TOKEN}` },
    });
    await expectResponseStatus(response, 401);
  });

  test('Logout without token', async ({ request }) => {
    await allure.suite('Logout');
    await allure.layer('API');
    await allure.label('AS_ID', '1877');
    const response = await request.post('/api/v1/logout');
    await expectResponseStatus(response, 401);
  });

  test('Logout with expired token', async ({ request }) => {
    await allure.suite('Logout');
    await allure.layer('API');
    await allure.label('AS_ID', '1880');
    const { token } = await UserFactory.createUser(request, 1, 1);
    await waitForSeconds(1);
    const response = await request.post('/api/v1/logout', {
      headers: { Authorization: `Bearer ${token}` },
    });

    await expectResponseStatus(response, 401);
    const responseBody = await response.json();
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.TOKEN_EXPIRED_2_ERROR
    );
  });
});
