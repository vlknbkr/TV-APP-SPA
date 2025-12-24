import { test, expect } from '../src/fixtures/fixtures.js';
const offset = 2;

test.describe('Favorites', () => {
    test('Remove from Favorites', async ({ homePage }) => {
        await homePage.open();
        await homePage.navigate('Apps');
        await homePage.openEditModeOnFavApp('Netflix');
        await homePage.removeFocusedFavApp();

        await expect(homePage.favAppList.appLocator('Netflix')).toHaveCount(0);
    });
});