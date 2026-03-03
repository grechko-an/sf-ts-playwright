import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BrowserContext } from 'playwright';
import { selector } from '../../utils/test-data-attribute';


export const TopMenuPage = (page: Page, context: BrowserContext) => {
    const main = page.locator('app-header');
    const hamburgerButton = main.locator('div.menu-open');
    const userAccountButton = main.locator(selector('user-account-button'));
    const signInButton = main.locator(selector('login-button'));
    const signUpButton = main.locator(selector('registration-button'));

    return {
        clickHamburgerButton: async () => {
            await allure.step(`Click Hamburger button`, async () => {
                await hamburgerButton.click();
            });
        },

        clickSignInButton: async () => {
            await allure.step(`Click Sign In button`, async () => {
                await signInButton.click();
            });
        },

        clickSignUpButton: async () => {
            await allure.step(`Click Sign Up button`, async () => {
                await signUpButton.click();
            });
        },

        clickUserAccountButton: async () => {
            await allure.step(`Click User Account button`, async () => {
                await userAccountButton.click();
            });
        },

        main,
        hamburgerButton,
        userAccountButton,
        signInButton,
        signUpButton,
    };
};
