import { test, expect } from '../src/fixtures/fixtures.js';

test.describe('Search', () => {
  test('Verify we can open a category from the search page', async ({ searchPage }) => {
    await searchPage.open();

    const genreName = 'Action';

    await searchPage.openGenre(genreName);

    await expect(searchPage.search.results.tabs(), 'Search results tabs should be visible').toBeVisible();

    await searchPage.search.results.waitUntilResolved();
  });
});