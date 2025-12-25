import { test, expect } from '../src/fixtures/fixtures.js';

test('Verify an app can be added to favorites', async ({ cleanFavState, appsPage, homePage }) => {
    await appsPage.open();
    await appsPage.focusApp(cleanFavState.category, cleanFavState.name);
    await appsPage.addFocusedAppToFavApps(cleanFavState.category, cleanFavState.name);

    await expect
        .poll(async () => await homePage.favAppList.exists(cleanFavState.name), {
            timeout: 15000,
            message: `App ${cleanFavState.name} should have appeared in Favorites`
        })
        .toBe(true);
});