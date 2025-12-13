import { test, expect } from "../src/fixtures/fixtures.js";
import { getAppCoordinatesInFavoriteList } from "../src/utils/AppUtils.js";

const appData = { featureName: 'Entertainment', appName: 'tabii' };
let indexOfApp;

test.describe.serial('Favorites Workflow', () => {

    // 1st Pass: Add app to favorites
    test(`Add ${appData.appName} to favorites`, async ({ appsPage }) => {
        await appsPage.open();
        await appsPage.goToApp(appData.featureName, appData.appName);
        expect(await appsPage.isItemFocused(appData.appName)).toBe(true);
        await appsPage.remote.select();
        await appsPage.addToFavorites();

        let isIndexed = false;
        for (let i = 0; i < 5; i++) {
            console.log("searching for app in favorite list ", i);
            const result = await getAppCoordinatesInFavoriteList(appsPage.page, appData.appName);
            if (result !== false) {
                indexOfApp = result;
                isIndexed = true;
                break;
            }
            await appsPage.page.waitForTimeout(1500);
        }
        expect(isIndexed).toBe(true);
    });

    // 2nd Pass: Remove app from favorites
    test(`Remove ${appData.appName} from favorites`, async ({ homePage }) => {
        await homePage.open();
        await homePage.goToApp(appData.appName);
        expect(await homePage.isItemFocused(appData.appName)).toBe(true);

        await homePage.remote.longPressSelect();
        await homePage.remote.down();
        await homePage.remote.select();

        let isFocused = true;
        for (let i = 0; i < 5; i++) {
            if (!await homePage.isItemFocused(appData.appName)) {
                isFocused = false;
                break;
            }
            console.log("failed in ", i);
            await homePage.page.waitForTimeout(1500);
        }
        expect(isFocused).toBe(false);
    });
});


