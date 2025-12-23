import { BasePage } from '../core/BasePage.js';
import { FavoritesRowComponent } from '../components/FavoritesRowComponent.js';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';

export class HomePage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     * @param {{ remote?: import('../utils/RemoteControl.js').RemoteControl }} [options]
     */
    constructor(page, options = {}) {
        super(page, options);
        this.favRow = new FavoritesRowComponent(page.locator(TITAN_OS_LOCATORS.FAVOURITE_APPS_CONTAINER), page);
    }

    async open() {
        await this.goto('');
    }

    async isLoaded() {
        return (await this.favRow.isContentReady()) && (await this.favRow.count()) > 0;
    }

    /**
     * @param {string} appId
     */
    async focusFavorite(appId) {
        const items = this.favRow.items();
        const count = await items.count();
        let targetIndex = -1;

        for (let i = 0; i < count; i++) {
            // Assuming we can identify by some attribute or we have to use the item component wrapper?
            // The previous logic used aria-label.
            // Let's check if we can match appId to something.
            // The `favRow.item(appId)` uses `[data-app-id="${appId}"]`.
            // So we should look for that.
            // But we need the index.
            const item = items.nth(i);
            // We can check if this item matches the selector `[data-app-id="${appId}"]`
            // Or simpler: get attribute data-app-id?
            const id = await item.getAttribute('data-app-id');
            if (id === appId) {
                targetIndex = i;
                break;
            }
            // Fallback: aria-label if appId is name (Legacy support if needed, but strict signature implies strict appId usage)
            const label = await item.getAttribute('aria-label');
            if (label && label.trim().toLowerCase() === appId.trim().toLowerCase()) {
                targetIndex = i;
                break;
            }
        }

        if (targetIndex === -1) {
            throw new Error(`Favorite with appId "${appId}" not found`);
        }

        // Naive navigation: assume we start from 0 or just scroll right?
        // Proper navigation: find focused index.
        // Optimization: assume list starts at 0 focused if we just opened?
        // Safer: find current focus.
        let focusedIndex = 0;
        for (let i = 0; i < count; i++) {
            const focused = await items.nth(i).getAttribute('data-focused');
            if (focused === 'true') {
                focusedIndex = i;
                break;
            }
        }

        const diff = targetIndex - focusedIndex;
        if (diff > 0) {
            await this.remote.right(diff);
        } else if (diff < 0) {
            await this.remote.left(Math.abs(diff));
        }

        // Ensure it is focused
        await this.remote.assertFocused(this.favRow.item(appId).locator());
    }

    /**
     * @param {string} appId
     */
    async openEditModeOnFavorite(appId) {
        await this.focusFavorite(appId);
        await this.remote.longPressSelect({ ensureFocused: this.favRow.item(appId).locator() });
    }

    async removeFocusedFavorite() {
        await this.remote.down();
        // Assuming 'down' moves focus to the remove button
        // We can try to use ensureFocused if we knew the locator of the remove button of the *currently focused* item.
        // The previously focused item (the tile) is not focused anymore.
        // But we don't have a parameter for appId here.
        // So we just call select.
        await this.remote.select();
    }
}
