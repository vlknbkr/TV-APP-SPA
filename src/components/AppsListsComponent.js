import { BaseComponent } from './BaseComponent.js';
import { AppsCategoryRowComponent } from './AppsCategoryRowComponent.js';

export class AppsListsComponent extends BaseComponent {
    /**
     * @param {import('@playwright/test').Locator} root
     * @param {import('@playwright/test').Page} page
     */
    constructor(root, page) {
        super(root, page);
    }

    rows() {
        return this.root.locator('[data-testid^="list-item-app_list-"]');
    }

    async countRows() {
        return this.rows().count();
    }

    rowByIndex(index) {
        return new AppsCategoryRowComponent(this.rows().nth(index), this.page());
    }

    rowByCategory(categoryName) {
        // strict aria-label match on the row element itself
        return new AppsCategoryRowComponent(
            this.root.locator(`[data-testid^="list-item-app_list-"][aria-label="${categoryName}"]`),
            this.page()
        );
    }
}
