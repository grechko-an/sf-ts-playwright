import { APIRequestContext, test } from '@playwright/test';

export async function getRandomCountryAndCurrency(
  request: APIRequestContext
): Promise<{ country: string; currency: string }> {
  return await test.step('Get a random country and its currency', async () => {
    const countriesResponse = await request.get('/api/v1/countries');
    if (!countriesResponse.ok()) {
      throw new Error(
        `Failed to fetch countries: ${countriesResponse.status()}`
      );
    }
    const countries = await countriesResponse.json();

    if (!Array.isArray(countries) || countries.length === 0) {
      throw new Error('Countries list is empty');
    }

    const randomCountry =
      countries[Math.floor(Math.random() * countries.length)];
    const countryCode = randomCountry.code;

    const currencyResponse = await request.get(
      `/api/v1/currencies?country=${countryCode}`
    );
    if (!currencyResponse.ok()) {
      throw new Error(
        `Failed to fetch currency for country ${countryCode}: ${currencyResponse.status()}`
      );
    }
    const currencies = await currencyResponse.json();

    if (!Array.isArray(currencies) || currencies.length === 0) {
      throw new Error(`Currency list for country ${countryCode} is empty`);
    }

    const currencyCode = currencies[0].code;

    return { country: countryCode, currency: currencyCode };
  });
}
