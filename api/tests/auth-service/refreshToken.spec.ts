import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { BROKEN_TOKEN } from '../../../core/constants/common';
import { APIErrorMessages } from '../../../core/constants/errors';
import {
  expectResponsePropertyValue,
  expectResponseStatus,
  expectTokenNotToBeSame,
  expectValueToBeTruthy,
  expectValueToMatchRegex,
} from '../../../core/expectFunctions';
import { UserFactory } from '../../../core/userFactory';
import { waitForSeconds } from '../../../e2e/utils/delay';

test.describe('Refresh token API tests', { tag: '@auth-service' }, async () => {
  test('Verify that a valid refresh token returns a new token', async ({
    request,
  }) => {
    await allure.suite('Refresh token');
    await allure.layer('API');
    await allure.label('AS_ID', '1519');
    const { token, refresh_token } =
      await UserFactory.createCredentials(request);
    const refreshTokenResponse = await request.post('/api/v1/refresh_token', {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `refresh_token=${refresh_token}`,
      },
    });

    await expectResponseStatus(refreshTokenResponse, 200);
    const { access_token } = await refreshTokenResponse.json();
    await expectValueToBeTruthy(access_token, 'access_token');
    await expectValueToMatchRegex(
      access_token,
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
      'access_token'
    );
    await expectTokenNotToBeSame(access_token.token, token);
  });

  test('Refresh token without refresh token', async ({ request }) => {
    await allure.suite('Refresh token');
    await allure.layer('API');
    await allure.label('AS_ID', '1517');
    const { token } = await UserFactory.createCredentials(request);
    const refreshTokenResponse = await request.post('/api/v1/refresh_token', {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `refresh_token=`,
      },
    });

    await expectResponseStatus(refreshTokenResponse, 401);
    const responseBody = await refreshTokenResponse.json();
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.TOKEN_UNVERIFIED_ERROR
    );
  });

  test('Refresh token with broken refresh token', async ({ request }) => {
    await allure.suite('Refresh token');
    await allure.layer('API');
    await allure.label('AS_ID', '1508');
    const { token } = await UserFactory.createCredentials(request);
    const refreshTokenResponse = await request.post('/api/v1/refresh_token', {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `refresh_token=${BROKEN_TOKEN}`,
      },
    });

    await expectResponseStatus(refreshTokenResponse, 401);
    const responseBody = await refreshTokenResponse.json();
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.TOKEN_UNVERIFIED_ERROR
    );
  });

  test('Refresh token with expired refresh token', async ({ request }) => {
    await allure.suite('Refresh token');
    await allure.layer('API');
    await allure.label('AS_ID', '1708');
    const { token, refresh_token } = await UserFactory.createCredentials(
      request,
      120,
      1
    );
    await waitForSeconds(1);
    const refreshTokenResponse = await request.post('/api/v1/refresh_token', {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `refresh_token=${refresh_token}`,
      },
    });

    await expectResponseStatus(refreshTokenResponse, 401);
    const responseBody = await refreshTokenResponse.json();
    await expectResponsePropertyValue(
      responseBody,
      'message',
      APIErrorMessages.TOKEN_UNVERIFIED_ERROR
    );
  });
});
