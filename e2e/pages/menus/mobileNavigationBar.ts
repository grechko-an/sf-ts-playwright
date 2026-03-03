import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BrowserContext } from 'playwright';


export const MobileNavigationBar  = (page: Page, context: BrowserContext) => {
    const main = page.locator('app-mobile-menu div.mobile-menu-buttons');
    const hamburgerButton = main.locator('[alt="menu"]');

    return {
        clickHamburgerButton: async () => {
            await allure.step(`Click Hamburger button`, async () => {
                await hamburgerButton.click();
            });
        },

        main,
        hamburgerButton,
    };
};
