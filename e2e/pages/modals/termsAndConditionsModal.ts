import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BrowserContext } from 'playwright';

import { selector } from '../../utils/test-data-attribute';

export const TermsAndConditionsModalPage = (page: Page, context: BrowserContext) => {
    const main = page.locator(selector('dialog-content'));
    const textBlock = main.locator('div.rules-page');
    const title = main.locator('h2.rules-page__title');
    const scrolableContent = main.locator('div.scrollable-content');
    const closeButtton = main.locator(selector('dialog-close-button'));

    return {
        clickCloseButton: async () => {
            await allure.step(`Click on the close button`, async () => {
                await closeButtton.click();
            });
        },
        clickOutside: async () => {
            await allure.step(`Click on a place outside modal`, async () => {
                await page.mouse.click(10, 10);
            });
        },
        main,
        textBlock,
        closeButtton,
        scrolableContent,
        title,
    };
};
