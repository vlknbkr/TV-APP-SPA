import { test } from '../src/fixtures/fixtures.js';

test.describe('Favorites', () => {
    test('Favorites', async ({ homePage }) => {
        await homePage.open();
        await homePage.isLoaded();
    });
});