import { expect, Locator } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { APIResponse } from 'playwright';

export async function expectToHaveURL(page: any, expectedUrl: string | RegExp) {
  await allure.step(
    `Verify that the current URL is ${expectedUrl}`,
    async () => {
      await expect(page).toHaveURL(expectedUrl);
    }
  );
}

export async function expectResponseStatus(
  response: APIResponse,
  expectedStatus: number
) {
  await allure.step(
    `Verify that the response status is ${expectedStatus}`,
    async () => {
      expect(response.status()).toBe(expectedStatus);
    }
  );
}

export async function expectResponseProperty(
  responseBody: any,
  property: string
) {
  await allure.step(
    `Verify that the response body contains the property "${property}"`,
    async () => {
      expect(responseBody).toHaveProperty(property);
    }
  );
}

export async function expectResponsePropertyWithValue(
  responseBody: any,
  property: string,
  expectedValue: any
) {
  await allure.step(
    `Verify that the response property "${property}" has value "${expectedValue}"`,
    async () => {
      expect(responseBody).toHaveProperty(property, expectedValue);
    }
  );
}

export async function expectResponsePropertyValue(
  responseBody: any,
  property: string,
  expectedValue: any
) {
  await allure.step(
    `Verify that the response property "${property}" is "${expectedValue}"`,
    async () => {
      expect(responseBody[property]).toBe(expectedValue);
    }
  );
}

export async function expectValueToBeTruthy(value: any, variableName: string) {
  await allure.step(`Verify that "${variableName}" is truthy`, async () => {
    expect(value).toBeTruthy();
  });
}

export async function expectValueToBeNull(value: any, variableName: string) {
  await allure.step(`Verify that "${variableName}" is null`, async () => {
    expect(value).toBeNull();
  });
}

export async function expectValueNotToBeNull(value: any, variableName: string) {
  await allure.step(`Verify that "${variableName}" is not null`, async () => {
    expect(value).not.toBeNull();
  });
}

export async function expectValueToBeUndefined(
  value: any,
  variableName: string
) {
  await allure.step(`Verify that "${variableName}" is undefined`, async () => {
    expect(value).toBeUndefined();
  });
}

export async function expectValueToMatchRegex(
  value: string,
  regex: RegExp,
  variableName: string
) {
  await allure.step(
    `Verify that "${variableName}" matches regex ${regex}`,
    async () => {
      expect(value).toMatch(regex);
    }
  );
}

export async function expectTokenNotToBeSame(
  newToken: string | null,
  oldToken: string | null
) {
  await allure.step(
    `Verify that the new token is not the same as the old token`,
    async () => {
      expect(newToken).not.toBe(oldToken);
    }
  );
}

export async function expectTextOnTheElement(
  element: Locator,
  expectedText: string
) {
  await allure.step(
    `Verify that the element contains text: "${expectedText}"`,
    async () => {
      await expect(element).toHaveText(expectedText);
    }
  );
}

export async function expectClassOnTheElement(
  element: Locator,
  expectedClass: RegExp
) {
  await allure.step(
    `Verify that the element contains class: "${expectedClass}"`,
    async () => {
      await expect(element).toHaveClass(expectedClass);
    }
  );
}

export async function expectElementToBeDisabled(
  element: Locator,
  name: string
) {
  await allure.step(`Verify that the element ${name} is disabled`, async () => {
    await expect(element).toBeDisabled();
  });
}

export async function expectElementIsVisible(element: Locator) {
  await allure.step(
    `Verify that the element "${element}" is visible`,
    async () => {
      await expect(element).toBeVisible();
    }
  );
}

export async function expectElementIsHidden(element: Locator) {
  await allure.step(
    `Verify that the element "${element}" is hidden`,
    async () => {
      await expect(element).toBeHidden();
    }
  );
}

export async function expectCheckboxToBeChecked(
  checkboxLocator: Locator,
  name: string
) {
  await allure.step(
    `Verify that the checkbox "${name}" is checked`,
    async () => {
      await expect(checkboxLocator).toBeChecked();
    }
  );
}

export async function expectResponseUsernameMatchesPattern(username: string) {
  await allure.step(
    'Verify username matches pattern Player[a-z0-9]+',
    async () => {
      expect(username).toMatch(/^Player[a-zA-Z0-9]+$/);
    }
  );
}

export async function expectElementHasColor(element: Locator, rgb: string) {
  await allure.step(
    `Verify that the element "${element}" has color ${rgb}`,
    async () => {
      await expect(element).toHaveCSS('color', `${rgb}`);
    }
  );
}
