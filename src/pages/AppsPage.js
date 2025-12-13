import { BasePage } from '../core/BasePage.js';
import { getAppCoordinates } from "../utils/AppUtils.js";
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
        const coordinates = await getAppCoordinates(this.list_selector, featureName, itemName);
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
        await expect(button, 'app is already added to favorites').toHaveText('Add to Favourites');
        
        await this.remote.select();

        await this.waitUntilHomeReady();

        await this.remote.select();
    }
}

module.exports = { AppsPage };
