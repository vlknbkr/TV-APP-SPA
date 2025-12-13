const { BasePage } = require('../core/BasePage');

import { TITAN_OS_LOCATORS } from '../locators/locators.js';


class HomePage extends BasePage {
    constructor(page) {
        super(page);
    }

    async open() {
        await this.goto();
    }

    async goToApp(appName) {
        const index = await this.getFavoriteAppIndex(appName);
        if (index === false) {
            throw new Error(`App not found: ${appName}`);
        }
        let colIndex = index;
        await this.remote.right(colIndex);
    }

    async deleteFromFavorites(appName) {
        const index = await this.getFavoriteAppIndex(appName);
        if (index !== false) {
            await this.remote.right(index);
            await this.remote.longPressSelect();
            await this.remote.down();
            await this.remote.select();
            await this.page.waitForTimeout(1000);
        }
    }

    async isAppInFavorites(appName) {
        const index = await this.getFavoriteAppIndex(appName);
        return index !== false;
    }

    async getFavoriteAppIndex(appName) {
        const favoriteList = this.page.locator(TITAN_OS_LOCATORS.FAVOURITE_APPS_CONTAINER);
        const lists = favoriteList.locator('[role="listitem"]');
        const targetApp = appName.trim().toLowerCase();
        const count = await lists.count();

        for (let colIndex = 0; colIndex < count; colIndex++) {
            const element = lists.nth(colIndex);
            const label = await element.getAttribute('aria-label');
            if (label && label.trim().toLowerCase() === targetApp) {
                console.log("App Found inside favorite List: ", appName);
                return colIndex;
            }
        }
        return false;
    }
}

module.exports = { HomePage };
