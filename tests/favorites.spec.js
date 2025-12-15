import { test, expect } from "../src/fixtures/fixtures.js";

const appData = { featureName: 'Entertainment', appName: 'tabii' };

test.describe.serial('Favorites Workflow', () => {

    test(`Add ${appData.appName} to favorites`, async ({ appsPage, homePage }) => {
        await homePage.open();

        // Ensure precondition
        await homePage.ensureAppNotInFavorites(appData.appName);

        // Action
        await appsPage.addAppToFavorites(appData.featureName, appData.appName);

        // Assertion
        await homePage.ensureAppInFavorites(
            appData.appName,
            appData.featureName,
            appsPage
        );
    });

    test(`Remove ${appData.appName} from favorites`, async ({ homePage, appsPage }) => {
        await homePage.open();

        // Ensure precondition
        await homePage.ensureAppInFavorites(
            appData.appName,
            appData.featureName,
            appsPage
        );

        // Action
        await homePage.deleteApp(appData.appName);

        // Assertion
        await homePage.ensureAppNotInFavorites(appData.appName);
    });
});
