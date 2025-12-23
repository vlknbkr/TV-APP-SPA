import { AppItemComponent } from './AppItemComponent.js';

export class FavoriteAppItemComponent extends AppItemComponent {
    /**
     * @param {import('@playwright/test').Locator} root
     * @param {import('@playwright/test').Page} page
     */
    constructor(root, page) {
        super(root, page);
    }

    removeButton() {
        return this.root.locator('[data-testid="remove-button"]');
    }

    async isRemoveDisabled() {
        return this.removeButton().isDisabled();
    }
}
