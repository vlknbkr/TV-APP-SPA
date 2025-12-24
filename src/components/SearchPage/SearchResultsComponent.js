// src/components/SearchResultsComponent.js
import { expect } from '@playwright/test';
import { BaseComponent } from '../BasePage/BaseComponent.js';

export class SearchResultsComponent extends BaseComponent {
    /**
     * root should be the Search page root (e.g. page.locator('div._search_1nsw1_1'))
     * @param {import('@playwright/test').Locator} root
     * @param {import('@playwright/test').Page} page
     */
    constructor(root, page) {
        super(root, page);

        this.resultsRoot = this.root.locator('div._searchResults_mzaal_1');
        this.tabsLocator = this.root.locator('#search-results-tabs[role="tablist"]');
        this.gridLocator = this.root.locator('#search-results-grid[role="list"]');
        this.emptyStateLocator = this.root.locator('h2:has-text("No results found")');
    }

    container() {
        return this.resultsRoot;
    }

    tabs() {
        return this.tabsLocator;
    }

    grid() {
        return this.gridLocator;
    }

    emptyStateTitle() {
        return this.emptyStateLocator;
    }

    /**
     * Wait until the search results area is resolved:
     * - either results grid is visible (and ready to interact),
     * - or empty state is shown.
     */
    async waitUntilResolved(timeout = 15000) {
        await expect(this.container()).toBeVisible({ timeout });

        await expect
            .poll(
                async () => {
                    const gridVisible = await this.grid().isVisible();
                    const emptyVisible = await this.emptyStateTitle().isVisible();
                    return gridVisible || emptyVisible;
                },
                { timeout }
            )
            .toBe(true);
    }

    async hasAnyResults() {
        if (!(await this.grid().isVisible())) return false;
        return (await this.grid().locator('[role="listitem"]').count()) > 0;
    }
}