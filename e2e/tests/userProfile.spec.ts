import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import {
    expectElementIsVisible,
    expectToHaveURL,
} from '../../core/expectFunctions';
import { UserProfilePage } from '../pages/userProfilePage';
import { HomePage } from '../pages/homePage';
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '../../core/constants/common';
import { TopMenuPage } from '../pages/menus/topMenu';
import { AuthorizationPage } from '../pages/authorizationPage';
import { TestDataGenerator } from '../../api/utils/testDataGenerator';
import { RegistrationPage } from '../pages/registrationPage';
import { UserFactory } from '../../core/userFactory';

test.describe('User profile page', async () => {

    test.describe('Security tab', () => {

        test.describe('Limits tab', () => {
            test('User is able to set Deposit limit', async ({
                request,
                page,
                browser,
            }) => {
                await allure.suite('User profile page');
                await allure.layer('E2E');
                await allure.label('AS_ID', '');

                const { email, password } = await UserFactory.createUser(request);

                const context = await browser.newContext();
                const authorizationPage = AuthorizationPage(page, context);
                const topMenu = TopMenuPage(page, context);
                const userProfilePage = UserProfilePage(page, context);

                await authorizationPage.openPage('');
                await topMenu.clickSignInButton();
                await authorizationPage.fillLogin(email);
                await authorizationPage.fillPassword(password);
                await authorizationPage.clickLoginButton();

                await expectElementIsVisible(topMenu.userAccountButton);

                await topMenu.clickUserAccountButton();
                await userProfilePage.clickSecurityTabButton();
                await userProfilePage.clickLimitsTabButton();
                

            });
        });


    });


});
