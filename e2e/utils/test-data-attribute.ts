import { Locator } from '@playwright/test';

export const testAttrName = 'data-qa';

export function selector(value: string, strict = true): string {
  return `[${testAttrName}${strict ? '=' : '*='}"${value}"]`;
}

export async function getDataAttribute(locator: Locator): Promise<any> {
  const data = await locator.getAttribute(testAttrName);

  return data && JSON.parse(data);
}
