import { BasePage } from '../core/BasePage.js';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';
import { expect } from "@playwright/test";


export class HomePage extends BasePage {
    constructor(page) {
        super(page);

        this.menuItem = page.locator(TITAN_OS_LOCATORS.MENU_ITEM('Home'));
        this.favList = page.locator(TITAN_OS_LOCATORS.FAVOURITE_APPS_CONTAINER);
        this.favApp = (appName) => page.locator(TITAN_OS_LOCATORS.FAVORITE_APP(appName));
    }

    async open() {
        await this.goto();
        await this.waitUntilHomeReady();
    }

    async navigateToAppInFavList(appName) {
        const index = await this.getFavoriteAppIndex(appName);
        if (index < 0) {
            throw new Error(`Favorite app not found: ${appName}`);
        }
        await this.remote.right(index);
    }

    async deleteAppFromFavlist(appName) {
        await this.navigateToAppInFavList(appName);

        console.log(`App ${appName} is in favorites, deleting...`);
        await this.remote.longPressSelect();
        await this.remote.down();
        //add focused element check??? 
        await this.remote.select();
    }

    async getFavoriteAppIndex(appName) {
        const lists = this.favList.locator('[role="listitem"]');
        const count = await lists.count();

        console.log(`number of app in Fav List found as ${count}`);

        for (let colIndex = 0; colIndex < count; colIndex++) {
            const element = lists.nth(colIndex);
            const label = await element.getAttribute('aria-label');
            if (label && label.trim().toLowerCase() === appName.trim().toLowerCase()) {
                console.log(`Index of the ${appName} in Fav List IS ${colIndex}`)
                return colIndex;
            }
        }
        return -1;
    }

    async ensureAppNotExistInFavList(appName) {
        const app = this.favApp(appName);
        await this.waitUntilFavListLoad();

        if (await app.isVisible()) {
            console.log(`${appName} exist in Fav List, deleting...`)
            await this.deleteAppFromFavlist(appName);
        }
        await this.expectAppNotExistInFavList(appName);
    }


    async ensureAppExistInFavList(appName, featureName, appsPage) {
        const app = this.favApp(appName);
        await this.waitUntilFavListLoad();

        if (!await app.isVisible()) {
            console.log(`${appName} does not exist in FavList, adding...`)
            await appsPage.addAppToFavList(featureName, appName);
            await this.remote.select();
        }
        await this.waitUntilFavListLoad();
        await this.expectAppExistInFavList(appName);
    }

    async waitUntilFavListLoad() {
        await this.page.waitForTimeout(2000);

        await expect(async () => {
            expect(await this.favList.isVisible(), "Failed: Fav list container is NOT visible")
        }).toPass({
            intervals: [1000, 2000, 5000],
            timeout: 20000,
        });
        console.log(`Success: Fav List container is visible.`);
    }

    async expectAppExistInFavList(appName) {
        const app = this.favApp(appName);
        await this.page.waitForTimeout(1000);
        await this.waitUntilFavListLoad();

        await expect(async () => {
            expect(await app.isVisible(), `Failed: ${appName} is NOT exist in Fav List`)
        }).toPass({
            intervals: [500, 1000, 2000],
            timeout: 10000,
        });
        console.log(`Success: "${appName}" is visible in favorites.`);
    }

    async expectAppNotExistInFavList(appName) {
        const app = this.favApp(appName);
        await this.page.waitForTimeout(1000);
        await this.waitUntilFavListLoad();

        await expect(async () => {
            expect(!await app.isVisible(), `Failed: ${appName} is NOT exist in Fav List`)
        }).toPass({
            intervals: [500, 1000, 2000],
            timeout: 10000,
        });
        console.log(`Success: "${appName}" is no longer exist in Fav List.`);
    }

    async waitUntilHomeReady() {
        await this.page.waitForTimeout(2000);

        await expect(this.menuItem).toHaveAttribute('aria-selected', 'true');

        await expect(async () => {
            const containerCount = await this.favList.count();

            if (containerCount === 0) {
                throw new Error('Favorites container not rendered yet');
            }

            const itemsCount = await this.favList
                .locator('[role="listitem"]')
                .count();

            if (itemsCount === 0) {
                throw new Error('Favorites content not resolved yet');
            }

        }).toPass({
            intervals: [1000, 2000, 5000],
            timeout: 20000,
        });
        console.log(`Home Page is fully loaded.`)
    }
}
