import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

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

test.describe(
  'Delete credentials API tests',
  { tag: '@auth-service' },
  async () => {
    test('Successful delete credentials', async ({ request }) => {
      await allure.suite('Delete credentials');
      await allure.layer('API');
      await allure.label('AS_ID', '1637');
      const { email, password, uuid } =
        await UserFactory.createCredentials(request);
      const response = await request.delete(
        `/api/internal/credentials/${uuid}`
      );
      await expectResponseStatus(response, 200);
      const responseBody = await response.json();
      await expectResponseProperty(responseBody, 'status');

      const responseAuth = await request.post('/api/v1/auth', {
        data: { login: email, password: password },
      });
      await expectResponseStatus(responseAuth, 401);
      const responseAuthBody = await responseAuth.json();
      await expectResponsePropertyValue(
        responseAuthBody,
        'code',
        APIErrorCodes.UNAUTHORIZED_ERROR
      );
      await expectResponsePropertyValue(
        responseAuthBody,
        'message',
        APIErrorMessages.INVALID_CREDENTIALS_ERROR
      );
    });

    test('Delete already deleted credentials', async ({ request }) => {
      await allure.suite('Delete credentials');
      await allure.layer('API');
      await allure.label('AS_ID', '1639');
      const { uuid } = await UserFactory.createCredentials(request);
      const response = await request.delete(
        `/api/internal/credentials/${uuid}`
      );
      await expectResponseStatus(response, 200);

      const response2 = await request.delete(
        `/api/internal/credentials/${uuid}`
      );
      await expectResponseStatus(response2, 400);
      const responseAuthBody = await response2.json();
      await expectResponsePropertyValue(
        responseAuthBody,
        'code',
        APIErrorCodes.ENTITY_NOT_FOUND
      );
      await expectResponsePropertyValue(
        responseAuthBody,
        'message',
        APIErrorMessages.CREDENTIALS_NOT_FOUND_ERROR
      );
    });

    test('Delete credentials without uuid', async ({ request }) => {
      await allure.suite('Delete credentials');
      await allure.layer('API');
      await allure.label('AS_ID', '1638');
      const uuid = '';

      const response = await request.delete(
        `/api/internal/credentials/${uuid}`
      );
      await expectResponseStatus(response, 404);
    });
  }
);
