import { test, expect } from "../src/fixtures/fixtures.js";


const appData = { featureName: 'Entertainment', appName: 'tabii' };

test.describe.serial('Favorites Workflow', () => {

    // 1st Pass: Add app to favorites
    test(`Add ${appData.appName} to favorites`, async ({ appsPage, homePage }) => {
        await homePage.open();
        if (await homePage.isAppInFavorites(appData.appName)) {
            console.log(`App ${appData.appName} is already in favorites, removing it...`);
            await homePage.deleteFromFavorites(appData.appName);
        }
        await appsPage.addAppToFavorites(appData.featureName, appData.appName);

        await expect(async () => {
            const isFavorite = await homePage.isAppInFavorites(appData.appName);
            expect(isFavorite).toBe(true);
        }).toPass({
            intervals: [2000, 5000, 10000],
            timeout: 60000
        });
    });

    // 2nd Pass: Remove app from favorites
    test(`Remove ${appData.appName} from favorites`, async ({ homePage, appsPage }) => {
        await homePage.open();
        if (!await homePage.isAppInFavorites(appData.appName)) {
            console.log("App not found in favorites, adding it first...");
            await appsPage.addAppToFavorites(appData.featureName, appData.appName);
            await homePage.open();
        }

        await homePage.goToApp(appData.appName);
        expect(await homePage.isItemFocused(appData.appName)).toBe(true);

        await homePage.remote.longPressSelect();
        await homePage.remote.down();
        await homePage.remote.select();
        
        await expect(async () => {
            const isFavorite = await homePage.isAppInFavorites(appData.appName);
            console.log("App Found inside favorite List: ", isFavorite);
            expect(isFavorite).toBe(false);
        }).toPass({
            intervals: [2000, 5000, 10000],
            timeout: 60000
        });
    });
});
