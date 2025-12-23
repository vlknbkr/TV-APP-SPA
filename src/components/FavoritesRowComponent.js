import { BaseComponent } from './BaseComponent.js';
import { FavoriteAppItemComponent } from './FavoriteAppItemComponent.js';

export class FavoritesRowComponent extends BaseComponent {
    /**
     * @param {import('@playwright/test').Locator} root
     * @param {import('@playwright/test').Page} page
     */
    constructor(root, page) {
        super(root, page);
    }

    items() {
        return this.root.locator('[role="listitem"]');
    }

    async count() {
        return this.items().count();
    }

    async isContentReady() {
        const ready = await this.root.getAttribute('data-content-ready');
        return ready === 'true';
    }

    async exists(appId) {
        return await this.item(appId).locator().count() > 0;
    }

    item(appId) {
        return new FavoriteAppItemComponent(this.root.locator(`[data-app-id="${appId}"]`), this.page());
    }

    focusedItem() {
        return new FavoriteAppItemComponent(this.root.locator('[data-focused="focused"]'), this.page());
    }
}
