import { APIRequestContext, test } from '@playwright/test';
import { uuidv7 } from 'uuidv7';

import { getRandomCountryAndCurrency } from './countryAndCurrencyGenerator';
import { TestDataGenerator } from '../api/utils/testDataGenerator';

export class UserFactory {
  static async login(
    email: string,
    password: string,
    request: APIRequestContext,
    accessLifetime?: number,
    refreshLifetime?: number
  ): Promise<{ token: string; refresh_token: string }> {
    return await test.step('Login user via API', async () => {
      let token = '';
      let refresh_token: string | undefined = '';
      let url =
        accessLifetime !== undefined || refreshLifetime !== undefined
          ? '/api/internal/test/auth'
          : '/api/v1/auth';
      if (accessLifetime !== undefined || refreshLifetime !== undefined) {
        const params = new URLSearchParams();
        if (accessLifetime !== undefined) {
          params.append('accessLifetime', accessLifetime.toString());
        }
        if (refreshLifetime !== undefined) {
          params.append('refreshLifetime', refreshLifetime.toString());
        }
        url += `?${params.toString()}`;
      }
      const loginResponse = await request.post(url, {
        data: { login: email, password: password },
      });
      const cookies = await request.storageState();
      const refreshTokenCookie = cookies.cookies.find(
        (cookie) => cookie.name === 'refresh_token'
      );
      if (!refreshTokenCookie) {
        throw new Error('Refresh_token was not find in cookies');
      }
      refresh_token = refreshTokenCookie.value;
      if (loginResponse.status() !== 200) {
        throw new Error(`User login failed: ${await loginResponse.text()}`);
      }
      const loginData = await loginResponse.json();
      token = loginData.access_token;

      return { token, refresh_token };
    });
  }

  static async createCredentials(
    request: APIRequestContext,
    accessLifetime?: number,
    refreshLifetime?: number
  ): Promise<{
    email: string;
    password: string;
    uuid: string;
    token: string;
    refresh_token: string;
  }> {
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();
    const uuid = uuidv7();

    await test.step('Create credentials via API', async () => {
      const registerResponse = await request.post(
        '/api/internal/credentials_add',
        {
          data: { user_id: uuid, email: email, password: password },
        }
      );
      if (registerResponse.status() !== 200) {
        throw new Error(
          `Credentials creation failed: ${await registerResponse.text()}`
        );
      }
    });

    const { token, refresh_token } = await this.login(
      email,
      password,
      request,
      accessLifetime,
      refreshLifetime
    );

    return { email, password, uuid, token, refresh_token };
  }

  static async createUser(
    request: APIRequestContext,
    accessLifetime?: number,
    refreshLifetime?: number
  ): Promise<{
    email: string;
    password: string;
    token: string;
    refresh_token: string;
    accessLifetime?: number;
    refreshLifetime?: number;
  }> {
    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();
    const { country, currency } = await getRandomCountryAndCurrency(request);

    await test.step('Register user via API', async () => {
      const registerResponse = await request.post('/api/v1/register', {
        data: { country, currency, email: email, password: password },
      });
      if (registerResponse.status() !== 200) {
        throw new Error(
          `User registration failed: ${await registerResponse.text()}`
        );
      }
    });

    const { token, refresh_token } = await this.login(
      email,
      password,
      request,
      accessLifetime,
      refreshLifetime
    );

    return { email, password, token, refresh_token };
  }
}
