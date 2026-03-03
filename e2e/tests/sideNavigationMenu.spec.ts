import { devices, test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { TestDataGenerator } from '../../api/utils/testDataGenerator';
import {
  expectElementHasColor,
  expectElementIsHidden,
  expectElementIsVisible,
} from '../../core/expectFunctions';
import { UserProfilePage } from '../pages/userProfilePage';
import { RegistrationPage } from '../pages/registrationPage';
import { HomePage } from '../pages/homePage';
import { SideNavigationMenuPage } from '../pages/menus/sideNavigationMenu';
import { PromotionsPage } from '../pages/promotionsPage';
import { TournamentsPage } from '../pages/tournamentsPage';
import { JackpotPage } from '../pages/jackpotPage';
import { SlotGamesPage } from '../pages/slotGamesPage';
import { LiveCasinoPage } from '../pages/liveCasinoPage';
import { CrashGamesPage } from '../pages/crashGamesPage';
import { TableGamesPage } from '../pages/tableGamesPage';
import { TopGamesPage } from '../pages/topGamesPage';
import { AllProvidersPage } from '../pages/allProvidersPage';
import { FaqPage } from '../pages/faqPage';
import { TermsOfUsePage } from '../pages/termsOfUsePage';
import { PrivacyPolicyPage } from '../pages/privacyPolicyPage';
import { CustomerSupportPage } from '../pages/customerSupportPage';
import { SELECTED_LINK_COLOR_V_1, SELECTED_LINK_COLOR_V_2, SELECTED_LINK_COLOR_V_3 } from '../../core/constants/common';
import { TopMenuPage } from '../pages/menus/topMenu';
import { MobileHomePage } from '../pages/mobileHomePage';
import { MobileNavigationBar } from '../pages/menus/mobileNavigationBar';
import { Mobile_NavigationModalPage } from '../pages/modals/mobile_NavigationModal';

test.describe('Side navigation menu E2E tests', async () => {
  test('Side navigation menu is displaying for logined out user', async ({
    page,
    browser,
  }) => {
    await allure.suite('Side navigation menu');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2579');

    const context = await browser.newContext();
    const sideNavigationMenuPage = SideNavigationMenuPage(page, context);
    const homePage = HomePage(page, context);

    await homePage.openPage('');
    await expectElementIsVisible(homePage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementIsHidden(sideNavigationMenuPage.logOutButton);
  });

  test('Side navigation menu is displaying for logined in user. User can open all available pages via menu. Current active page is highlighting in menu', async ({
    page,
    browser,
  }) => {
    await allure.suite('Side navigation menu');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2580');

    const email = TestDataGenerator.generateEmail();
    const password = TestDataGenerator.generatePassword();

    const context = await browser.newContext();
    const registrationPage = RegistrationPage(page, context);
    const profilePage = UserProfilePage(page, context);
    const sideNavigationMenuPage = SideNavigationMenuPage(page, context);
    const homePage = HomePage(page, context);
    const promotionsPage = PromotionsPage(page, context);
    const tournamentsPage = TournamentsPage(page, context);
    const jackpotPage = JackpotPage(page, context);
    const slotGamesPage = SlotGamesPage(page, context);
    const liveCasinoPage = LiveCasinoPage(page, context);
    const crashGamesPage = CrashGamesPage(page, context);
    const tableGamesPage = TableGamesPage(page, context);
    const topGamesPage = TopGamesPage(page, context);
    const allProvidersPage = AllProvidersPage(page, context);
    const faqPage = FaqPage(page, context);
    const termsOfUsePage = TermsOfUsePage(page, context);
    const privacyPolicyPage = PrivacyPolicyPage(page, context);
    const customerSupportPage = CustomerSupportPage(page, context);

    await registrationPage.openPage('');
    await registrationPage.signUpBtn.click();
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword(password);
    await registrationPage.selectRandomCountry();
    await registrationPage.selectRandomCurrency();
    await registrationPage.clickRegistrationButton();
    await expectElementIsVisible(profilePage.profileBtn);
    await expectElementIsVisible(homePage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);

    await sideNavigationMenuPage.clickPromotionsLink();
    await expectElementIsVisible(promotionsPage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementHasColor(sideNavigationMenuPage.promotionsLink, SELECTED_LINK_COLOR_V_1);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);

    await sideNavigationMenuPage.clickTournamentsLink();
    await expectElementIsVisible(tournamentsPage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementHasColor(sideNavigationMenuPage.tournamentsLink, SELECTED_LINK_COLOR_V_1);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);

    await sideNavigationMenuPage.clickJackpotLink();
    await expectElementIsVisible(jackpotPage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementHasColor(sideNavigationMenuPage.jackpotLink, SELECTED_LINK_COLOR_V_2);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);

    await sideNavigationMenuPage.clickSlotGamesLink();
    await expectElementIsVisible(slotGamesPage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementHasColor(sideNavigationMenuPage.slotGamesLink, SELECTED_LINK_COLOR_V_3);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);

    await sideNavigationMenuPage.clickLiveCasinoLink();
    await expectElementIsVisible(liveCasinoPage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementHasColor(sideNavigationMenuPage.liveCasinoLink, SELECTED_LINK_COLOR_V_3);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);

    await sideNavigationMenuPage.clickCrashGamesLink();
    await expectElementIsVisible(crashGamesPage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementHasColor(sideNavigationMenuPage.crashGamesLink, SELECTED_LINK_COLOR_V_3);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);

    await sideNavigationMenuPage.clickTableGamesLink();
    await expectElementIsVisible(tableGamesPage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementHasColor(sideNavigationMenuPage.tableGamesLink, SELECTED_LINK_COLOR_V_3);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);

    await sideNavigationMenuPage.clickTopGamesLink();
    await expectElementIsVisible(topGamesPage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementHasColor(sideNavigationMenuPage.topGamesLink, SELECTED_LINK_COLOR_V_3);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);

    await sideNavigationMenuPage.clickAllProvidersLink();
    await expectElementIsVisible(allProvidersPage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementHasColor(sideNavigationMenuPage.allProvidersLink, SELECTED_LINK_COLOR_V_3);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);

    await sideNavigationMenuPage.clickFaqLink();
    await expectElementIsVisible(faqPage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementHasColor(sideNavigationMenuPage.faqLink, SELECTED_LINK_COLOR_V_2);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);

    await sideNavigationMenuPage.clickTermsOfUseLink();
    await expectElementIsVisible(termsOfUsePage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementHasColor(sideNavigationMenuPage.termsOfUseLink, SELECTED_LINK_COLOR_V_2);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);

    await sideNavigationMenuPage.clickPrivacyPolicyLink();
    await expectElementIsVisible(privacyPolicyPage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementHasColor(sideNavigationMenuPage.privacyPolicyLink, SELECTED_LINK_COLOR_V_2);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);

    await sideNavigationMenuPage.clickCustomerSupportLink();
    await expectElementIsVisible(customerSupportPage.content);
    await expectElementIsVisible(sideNavigationMenuPage.main);
    await expectElementHasColor(sideNavigationMenuPage.customerSupportLink, SELECTED_LINK_COLOR_V_2);
    await expectElementIsVisible(sideNavigationMenuPage.logOutButton);
  });

  test('Opening and closing side navigation menu via Humburger button', async ({
    page,
    browser,
  }) => {
    await allure.suite('Side navigation menu');
    await allure.layer('E2E');
    await allure.label('AS_ID', '2581');

    const context = await browser.newContext();
    const sideNavigationMenuPage = SideNavigationMenuPage(page, context);
    const homePage = HomePage(page, context);
    const topMenu = TopMenuPage(page, context);

    await homePage.openPage('');
    await expectElementIsVisible(sideNavigationMenuPage.main);

    await topMenu.clickHamburgerButton();
    await expectElementIsHidden(sideNavigationMenuPage.main);

    await topMenu.clickHamburgerButton();
    await expectElementIsVisible(sideNavigationMenuPage.main);
  });

  test.describe('Another desktop screen resulution', () => {
    test.use({ viewport: { width: 769, height: 600 } });

    test('Side navigation menu is displaying on another screen resolution', async ({
      page,
      browser,
    }) => {
      await allure.suite('Side navigation menu');
      await allure.layer('E2E');
      await allure.label('AS_ID', '2582');

      const context = await browser.newContext();
      const sideNavigationMenuPage = SideNavigationMenuPage(page, context);
      const homePage = HomePage(page, context);

      await homePage.openPage('');
      await expectElementIsVisible(homePage.content);
      await expectElementIsVisible(sideNavigationMenuPage.main);
      await expectElementIsHidden(sideNavigationMenuPage.logOutButton);
    });
  });

  test.describe('Mobile resolution', () => {
    test.use({ viewport: { width: 430, height: 932 } });

    test('Side navigation menu is displaying on Mobile resolution', async ({
      page,
      browser,
    }) => {
      await allure.suite('Side navigation menu');
      await allure.layer('E2E');
      await allure.label('AS_ID', '2583');

      const context = await browser.newContext();
      const homePage = MobileHomePage(page, context);
      const mobileMenu = MobileNavigationBar(page, context);
      const mobileNavigationModal = Mobile_NavigationModalPage(page, context);

      await homePage.openPage('');
      await expectElementIsVisible(homePage.content);
      await expectElementIsVisible(mobileMenu.main);

      await mobileMenu.clickHamburgerButton();
      await expectElementIsVisible(mobileNavigationModal.content);
    });

  });

});
