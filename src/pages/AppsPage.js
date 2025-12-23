import { BasePage } from '../core/BasePage.js';
import { AppsListsComponent } from '../components/AppsListsComponent.js';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';
import { expect } from '@playwright/test';

export class AppsPage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     * @param {{ remote?: import('../utils/RemoteControl.js').RemoteControl }} [options]
     */
    constructor(page, options = {}) {
        super(page, options);
        this.lists = new AppsListsComponent(page.locator(TITAN_OS_LOCATORS.LIST_SELECTOR), page);
        this.addToFavBtnLocator = page.locator(TITAN_OS_LOCATORS.ADD_TO_FAVORITES_BUTTON);
    }

    async open() {
        await this.goto('page/499');
        await this.isLoaded();
    }

    async isLoaded() {
        const listsCount = await this.lists.countRows();
        if (listsCount === 0) return false;

        // Check first row has content
        const firstRow = this.lists.rowByIndex(0);
        const itemsCount = await firstRow.count();
        return itemsCount > 0;
    }

    /**
     * @param {string} categoryName
     */
    async focusCategory(categoryName) {
        const rows = this.lists.rows();
        const count = await rows.count();
        let targetIndex = -1;

        for (let i = 0; i < count; i++) {
            const row = this.lists.rowByIndex(i);
            const name = await row.getCategoryName();
            if (name && name.trim().toLowerCase() === categoryName.trim().toLowerCase()) {
                targetIndex = i;
                break;
            }
        }

        if (targetIndex === -1) throw new Error(`Category "${categoryName}" not found`);

        // Find current focused row index
        // We assume focus is somewhere inside one of the rows
        let currentFocusedRowIndex = 0; // Default to 0 if not found (e.g. top of page)
        /**
         * we can do this control with menu item. If menu item data-focused is true, 
         * it means currentFocusRowIndex is 0. So no need to run below check
         */
        for (let i = 0; i < count; i++) {
            const rowLocator = rows.nth(i);
            // Check if any element inside satisfied [data-focused="true"]
            if (await rowLocator.locator('[data-focused="true"]').count() > 0) {
                currentFocusedRowIndex = i;
                break;
            }
        }

        const diff = targetIndex - currentFocusedRowIndex;
        if (diff > 0) {
            await this.remote.down(diff);
        } else if (diff < 0) {
            await this.remote.up(Math.abs(diff));
        }

        // After moving vertically, we might want to ensure the row is actually focused 
        // (usually means one item in it is focused).
        // The previous logic didn't assert, but "focusCategory" implies success.
    }

    /**
     * @param {string} categoryName
     */
    async openCategory(categoryName) {
        await this.focusCategory(categoryName);
        // guard by focus? the category row container itself isn't usually focused, an item inside is.
        // If strict requirement "remote.select guarded by focus", 
        // maybe we verify *some* item in that category is focused.
        const row = this.lists.rowByCategory(categoryName);
        // Find *any* focused item in this row?
        const focusedItem = row.root.locator('[data-focused="true"]');
        await this.remote.select({ ensureFocused: focusedItem });
    }

    /**
     * @param {string} categoryName
     * @param {string} appId
     */
    async focusApp(categoryName, appId) {
        await this.focusCategory(categoryName);

        const row = this.lists.rowByCategory(categoryName);
        const items = row.items();
        const count = await items.count();
        let targetIndex = -1;

        for (let i = 0; i < count; i++) {
            const item = row.item(appId); // This logic relies on ID, but we need index for navigation
            // So we iterate items and find matching ID
            const currentItem = items.nth(i);
            const id = await currentItem.getAttribute('data-app-id');
            if (id === appId) {
                targetIndex = i;
                break;
            }
            // Fallback: name match? Not in strict signature but practical.
            // Skipping fallback to strict adhere to "appId"
        }

        if (targetIndex === -1) throw new Error(`App "${appId}" not found in category "${categoryName}"`);

        // Find current focused column in this row
        let currentCol = 0;
        for (let i = 0; i < count; i++) {
            if (await items.nth(i).getAttribute('data-focused') === 'true') {
                currentCol = i;
                break;
            }
        }

        const diff = targetIndex - currentCol;
        if (diff > 0) {
            await this.remote.right(diff);
        } else if (diff < 0) {
            await this.remote.left(Math.abs(diff));
        }

        await this.remote.assertFocused(row.item(appId).locator());
    }

    async addFocusedAppToFavorites() {
        // 1. Select the currently focused app (opens details?)
        await this.remote.select();

        // 2. Wait for "Add to Favorites" button
        await expect(this.addToFavBtnLocator).toBeVisible();

        // 3. Ensure it is focused (default behavior usually)
        await this.remote.assertFocused(this.addToFavBtnLocator);

        // 4. Click it
        const text = await this.addToFavBtnLocator.textContent();
        if (text === 'Add to Favourites') {
            await this.remote.select();
        } else if (text === 'Remove from Favourites') {
            // Already favorite
            return;
        }

        // 5. Wait for transition/URL?
        await this.waitForSpaReady();
    }
}