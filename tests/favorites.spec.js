import { test, expect } from "../src/fixtures/fixtures.js";

test.describe('Navigation Tests', () => {
    test('Adding a app tp the favorites', async ({ homePage }) => {
        await homePage.open();
        expect(homePage.page.url()).toContain(process.env.BASE_URL);
    });
});
