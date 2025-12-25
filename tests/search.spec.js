import { test, expect } from '../src/fixtures/fixtures.js';
import { APPS_DATA } from '../src/test-data/test.data.js';

const genreName = APPS_DATA.ACTION_GENRE;

test.describe('Search', () => {
  test('Verify we can open a category from the search page', async ({ searchPage }) => {
    await searchPage.open();

    await searchPage.openGenre(genreName);

    await expect(searchPage.search.results.tabs(), 'Search results tabs should be visible').toBeVisible();

    await searchPage.search.results.waitUntilResolved();
  });
});