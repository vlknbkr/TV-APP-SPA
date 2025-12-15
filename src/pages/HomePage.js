import { BasePage } from '../core/BasePage.js';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';
import { expect } from "@playwright/test";


export class HomePage extends BasePage {
    constructor(page) {
        super(page);
        this.favoriteList = this.page.locator(TITAN_OS_LOCATORS.FAVOURITE_APPS_CONTAINER);
        this.favApp = (appName) => page.locator(TITAN_OS_LOCATORS.FAVORITE_APP(appName));
    }

    async open() {
        await this.goto();
    }

    async goToApp(appName) {
        const index = await this.getFavoriteAppIndex(appName);
        if (index < 0) {
            throw new Error(`Favorite app not found: ${appName}`);
        }
        await this.remote.right(index);
    }

    async deleteApp(appName) {
        await this.goToApp(appName);

        await this.remote.longPressSelect();
        await this.remote.down();
        await this.remote.select();
        await this.page.waitForTimeout(2000);

        await this.page.reload();
    }

    async getFavoriteAppIndex(appName) {
        const lists = this.favoriteList.locator('[role="listitem"]');
        const count = await lists.count();

        for (let colIndex = 0; colIndex < count; colIndex++) {
            const element = lists.nth(colIndex);
            const label = await element.getAttribute('aria-label');
            if (label && label.trim().toLowerCase() === appName.trim().toLowerCase()) {
                return colIndex;
            }
        }
        return -1;
    }

    async ensureAppNotInFavorites(appName) {
        const app = this.favApp(appName);
        if (await app.isVisible()) {
            await this.deleteApp(appName);
        }
        await expect(app, 'App found in favorites').not.toBeVisible({ timeout: 10000 });
    }

    async ensureAppInFavorites(appName, featureName, appsPage) {
        const app = this.favApp(appName);
        if (!await app.isVisible()) {
            await appsPage.addAppToFavorites(featureName, appName);
        }
        await expect(app, 'App not found in favorites').toBeVisible({ timeout: 10000 });
    }
}
