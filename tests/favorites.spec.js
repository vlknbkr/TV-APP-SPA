import { test, expect } from '../src/fixtures/fixtures.js';

const testData = { categoryName: "News", appName: "CGTN" };

test.describe('Favorites Management', () => {
    test(`Remove ${testData.appName} from Favorites`, async ({ homePage, appsPage }) => {

        await appsPage.open();
        await appsPage.focusApp(testData.categoryName, testData.appName);
        await appsPage.addFocusedAppToFavApps(testData.categoryName, testData.appName);

        await homePage.remote.select();
        await homePage.isLoaded();

        await expect
            .poll(async () => await homePage.favAppList.exists(testData.appName), {
                timeout: 15000,
                message: `App ${testData.appName} should have appeared in Favorites`
            })
            .toBe(true);

        await homePage.focusFavApp(testData.appName);

        await homePage.removeFocusedFavApp(testData.appName);

        await expect
            .poll(async () => await homePage.favAppList.appLocator(testData.appName).count(), {
                timeout: 15000,
                message: `App ${testData.appName} should have been removed`
            })
            .toBe(0);
    });
});