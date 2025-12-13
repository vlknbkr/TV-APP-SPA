import { BasePage } from '../core/BasePage.js';

import { TITAN_OS_LOCATORS } from '../locators/locators.js';

import { expect } from '@playwright/test';

class AppsPage extends BasePage {
    constructor(page) {
        super(page);
        this.list_selector = this.page.locator(TITAN_OS_LOCATORS.LIST_SELECTOR);
        this.addToFavoritesButton = this.page.locator(TITAN_OS_LOCATORS.ADD_TO_FAVORITES_BUTTON);
    }

    async open() {
        await this.goto('page/499');
    }

    async goToApp(featureName, itemName) {
        const coordinates = await this.getAppCoordinates(this.list_selector, featureName, itemName);
        if (!coordinates) {
            throw new Error(`App not found: ${featureName} - ${itemName}`);
        }
        let { rowIndex, colIndex } = coordinates;
        rowIndex += 2;
        await this.remote.down(rowIndex);
        await this.remote.right(colIndex);
    }

    async addToFavorites() {
        const button = this.addToFavoritesButton;

        await expect(button).toBeVisible();
        await expect(button).toHaveAttribute('data-focused', 'true', {
            timeout: 5000,
        });

        const text = await button.innerText();
        if (text === 'Add to Favourites') {
            await this.remote.select();
            await this.waitUntilHomeReady();
            await this.remote.select();
        } else {
            console.log('App is already in favorites');
        }
    }

    async addAppToFavorites(featureName, appName) {
        await this.open();
        await this.goToApp(featureName, appName);
        await this.remote.select();
        await this.addToFavorites();
    }

    /**
     * Finds the coordinates (row and column index) of an app within a specific category.
     * Performs a case-insensitive search for both category and app name.
     * 
     * @param {import('@playwright/test').Locator} listContainer - The Locator for the list container.
     * @param {string} categoryName - The name of the category (e.g., "Sports").
     * @param {string} appName - The name of the app (e.g., "Red Bull TV").
     * @returns {Promise<{rowIndex: number, colIndex: number} | null>} The coordinates or null if not found.
     */
    async getAppCoordinates(listContainer, categoryName, appName) {
        const lists = listContainer.locator(TITAN_OS_LOCATORS.LIST_ITEM_TESTID_PREFIX);

        const listsCount = await lists.count();
        console.log("number of features : ", listsCount);
        const targetCategory = categoryName.trim().toLowerCase();
        const targetApp = appName.trim().toLowerCase();

        for (let rIndex = 0; rIndex < listsCount; rIndex++) {
            const list = lists.nth(rIndex);
            const label = await list.getAttribute('aria-label');

            if (label && label.trim().toLowerCase() === targetCategory) {
                const items = list.locator(TITAN_OS_LOCATORS.LIST_ITEM_ROLE);
                const itemsCount = await items.count();
                console.log("items : ", items);

                for (let cIndex = 0; cIndex < itemsCount; cIndex++) {
                    const item = items.nth(cIndex);
                    const testId = await item.getAttribute('data-testid');

                    if (testId && testId.trim().toLowerCase() === targetApp) {
                        console.log("Found app: ", targetApp);
                        console.log("rowIndex: ", rIndex);
                        console.log("colIndex: ", cIndex);
                        return { rowIndex: rIndex, colIndex: cIndex };
                    }
                }
            }
        }
        return false;
    }
}

module.exports = { AppsPage };
