import { test } from "../src/fixtures/fixtures.js";

const appData = { featureName: 'Entertainment', appName: 'tabii' };

test.describe.serial('Favorites Workflow', () => {

    test(`Add ${appData.appName} to favorites`, async ({ appsPage, homePage }) => {
        // Pre-condition
        await homePage.open();
        await homePage.ensureAppNotExistInFavList(appData.appName);

        // Action
        await appsPage.addAppToFavList(appData.featureName, appData.appName);

        // Assertion
        await homePage.expectAppExistInFavList(appData.appName);
    });

    test(`Remove ${appData.appName} from favorites`, async ({ homePage, appsPage }) => {
        // Pre-condition
        await homePage.open();
        await homePage.ensureAppExistInFavList(
            appData.appName,
            appData.featureName,
            appsPage
        );

        // Action
        await homePage.deleteAppFromFavlist(appData.appName);

        // Assertion
        await homePage.expectAppNotExistInFavList(appData.appName);
    });
});
