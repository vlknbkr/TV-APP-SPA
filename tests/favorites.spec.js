import { test, expect } from '../src/fixtures/fixtures.js';
const testData = { categoryName: "News", appName: "CGTN" };



test.describe('Favorites', () => {
    test('Remove from Favorites', async ({ homePage, appsPage }) => {
        //await homePage.open();
        //await homePage.navigate('Apps');
        await appsPage.open();
        await appsPage.focusApp(testData.categoryName, testData.appName);
        await appsPage.addFocusedAppToFavApps(testData.categoryName, testData.appName);

        //await homePage.isLoaded();
        await homePage.remote.select();

        await expect
            .poll(() => homePage.favAppList.exists(testData.appName), { timeout: 15000 })
            .toBe(true);
        await homePage.focusFavApp(testData.appName);
        await homePage.removeFocusedFavApp(testData.appName);

        await expect.poll(() => homePage.favAppList
            .appLocator(testData.appName)
            .count(), { timeout: 15000 })
            .toBe(0);
    });
});
