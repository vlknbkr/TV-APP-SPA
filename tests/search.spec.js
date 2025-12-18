import { test, expect } from "../src/fixtures/fixtures.js";

test.describe('Search Page', () => {
    test('search', async ({ searchPage }) => {
        // Pre-condition
        await searchPage.open();
        const categories = await searchPage.getCategoryList();
        const expectedURL = `${process.env.BASE_URL}search?q=${categories[0]}&type=movie`;

        // Action
        await searchPage.openCategory(categories[0]);

        //Assertion
        await expect(searchPage.page).toHaveURL(expectedURL);
    });
});