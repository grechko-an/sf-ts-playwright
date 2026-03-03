import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BrowserContext } from 'playwright';
import { selector } from '../../utils/test-data-attribute';


export const SideNavigationMenuPage = (page: Page, context: BrowserContext) => {
    const main = page.locator('div.main-layout__sidebar');
    const promotionsLink = main.getByText('Promotions');
    const tournamentsLink = main.getByText('Tournaments');
    const jackpotLink = main.getByText('Jackpot');
    const slotGamesLink = main.getByText('Slot Games');
    const liveCasinoLink = main.getByText('Live Casino');
    const crashGamesLink = main.getByText('Crash Games');
    const tableGamesLink = main.getByText('Table Games');
    const topGamesLink = main.getByText('Top Games');
    const allProvidersLink = main.getByText('All Providers');
    const faqLink = main.getByText('FAQ');
    const termsOfUseLink = main.getByText('Terms of use');
    const privacyPolicyLink = main.getByText('Privacy Policy');
    const customerSupportLink = main.getByText('Customer Support');
    const logOutButton = main.locator(selector('logout-button'));

    return {
        clickPromotionsLink: async () => {
            await allure.step(
                `Click Promotions tab in the side navigation menu`,
                async () => {
                    await promotionsLink.click();
                }
            );
        },

        clickTournamentsLink: async () => {
            await allure.step(
                `Click Tournaments tab in the side navigation menu`,
                async () => {
                    await tournamentsLink.click();
                }
            );
        },

        clickJackpotLink: async () => {
            await allure.step(
                `Click Jackpot tab in the side navigation menu`,
                async () => {
                    await jackpotLink.click();
                }
            );
        },

        clickSlotGamesLink: async () => {
            await allure.step(
                `Click Slot Games tab in the side navigation menu`,
                async () => {
                    await slotGamesLink.click();
                }
            );
        },

        clickLiveCasinoLink: async () => {
            await allure.step(
                `Click Live Casino tab in the side navigation menu`,
                async () => {
                    await liveCasinoLink.click();
                }
            );
        },

        clickCrashGamesLink: async () => {
            await allure.step(
                `Click Crash Games tab in the side navigation menu`,
                async () => {
                    await crashGamesLink.click();
                }
            );
        },

        clickTableGamesLink: async () => {
            await allure.step(
                `Click Table Games tab in the side navigation menu`,
                async () => {
                    await tableGamesLink.click();
                }
            );
        },

        clickTopGamesLink: async () => {
            await allure.step(
                `Click Top Games tab in the side navigation menu`,
                async () => {
                    await topGamesLink.click();
                }
            );
        },

        clickAllProvidersLink: async () => {
            await allure.step(
                `Click All Providers tab in the side navigation menu`,
                async () => {
                    await allProvidersLink.click();
                }
            );
        },

        clickFaqLink: async () => {
            await allure.step(
                `Click FAQ tab in the side navigation menu`,
                async () => {
                    await faqLink.click();
                }
            );
        },

        clickTermsOfUseLink: async () => {
            await allure.step(
                `Click Terms Of Use tab in the side navigation menu`,
                async () => {
                    await termsOfUseLink.click();
                }
            );
        },

        clickPrivacyPolicyLink: async () => {
            await allure.step(
                `Click Privacy Policy tab in the side navigation menu`,
                async () => {
                    await privacyPolicyLink.click();
                }
            );
        },

        clickCustomerSupportLink: async () => {
            await allure.step(
                `Click Customer Support tab in the side navigation menu`,
                async () => {
                    await customerSupportLink.click();
                }
            );
        },

        clickLogoutButton: async () => {
            await allure.step(
                `Click Logout button in the side navigation menu`,
                async () => {
                    await logOutButton.click();
                }
            );
        },

        main,
        promotionsLink,
        tournamentsLink,
        jackpotLink,
        slotGamesLink,
        liveCasinoLink,
        crashGamesLink,
        tableGamesLink,
        topGamesLink,
        allProvidersLink,
        faqLink,
        termsOfUseLink,
        privacyPolicyLink,
        customerSupportLink,
        logOutButton,
    };
};
