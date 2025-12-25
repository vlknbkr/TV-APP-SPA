import { test, expect } from '../src/fixtures/fixtures.js';

test('Delete app from favorites', async ({ readyToDeleteState, homePage }) => {
    await homePage.focusFavApp(readyToDeleteState.name);
    await homePage.removeFocusedFavApp(readyToDeleteState.name);

    await expect
        .poll(async () => await homePage.favAppList.exists(readyToDeleteState.name), {
            timeout: 15000,
            message: `App ${readyToDeleteState.name} should have been removed`
        })
        .toBe(false);
});