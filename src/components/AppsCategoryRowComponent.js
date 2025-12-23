import { BaseComponent } from './BaseComponent.js';
import { AppItemComponent } from './AppItemComponent.js';

export class AppsCategoryRowComponent extends BaseComponent {
    /**
     * @param {import('@playwright/test').Locator} root
     * @param {import('@playwright/test').Page} page
     */
    constructor(root, page) {
        super(root, page);
    }

    async getCategoryName() {
        return this.root.getAttribute('aria-label');
    }

    items() {
        return this.root.locator('[role="listitem"]');
    }

    async count() {
        return this.items().count();
    }

    async exists(appId) {
        return await this.item(appId).locator().count() > 0;
    }

    item(appId) {
        return new AppItemComponent(this.root.locator(`[data-app-id="${appId}"]`), this.page());
    }
}
