
import { BasePage } from '../core/BasePage.js';
import { expect } from '@playwright/test';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';

export class SearchPage extends BasePage {
    constructor(page) {
        super(page);

        this.menuItem = page.locator(TITAN_OS_LOCATORS.MENU_ITEM('Search'));
        this.searchInput = page.locator(TITAN_OS_LOCATORS.SEARCH_INPUT);
        this.categoryList = page.locator(TITAN_OS_LOCATORS.CATEGORY_LIST);
        this.categoryCard = (name) => page.locator(TITAN_OS_LOCATORS.CATEGORY_CARD(name));
    }

    async open() {
        await this.goto('search');
        await this.waitUntilSearchReady();
    }


    async openCategory(categoryName) {
        await this.waitUntilSearchReady();
        await expect(this.searchInput,
            'Search Input is NOT visible'
        ).toBeVisible();

        // Move focus from input to categories
        await this.remote.down();

        const target = this.categoryCard(categoryName);
        await this.expectFocused(target);

        await this.remote.select();
    }

    async getCategoryList() {
        await this.waitUntilSearchReady();

        const lists = this.categoryList.locator('[role="listitem"]');

        return await lists.evaluateAll(elements => 
            elements
                .map(el => el.getAttribute('aria-label')));
    }

    async waitUntilSearchReady() {
        const items = this.categoryList.locator('[role="listitem"]');

        await expect(this.menuItem).toHaveAttribute('aria-selected', 'true');
        await expect(async () => {
            const count = await items.count();
            if (count === 0) {
                throw new Error('Search categories not rendered yet');
            }
        }).toPass({
            intervals: [1000, 2000, 5000],
            timeout: 20000,
        });
        console.log(`Search Page is fully loaded.`)
    }
}
