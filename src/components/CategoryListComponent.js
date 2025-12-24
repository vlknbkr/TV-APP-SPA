// src/components/CategoryListComponent.js
import { BaseComponent } from './BaseComponent.js';
import { CategoryAppItemComponent } from './CategoryAppItemComponent.js';

export class CategoryListComponent extends BaseComponent {
    /**
     * Returns all category rows under lists-container.
     * Each row is: [data-testid^="list-item-"][role="list"]
     */
    categories() {
        return this.root.locator('[data-testid^="list-item-"][role="list"]');
    }

    async countCategories() {
        return this.categories().count();
    }

    /**
     * @param {number} i
     */
    categoryByIndex(i) {
        const row = this.categories().nth(i);
        return new CategoryAppItemComponent(row, this.page);
    }

    
    /**
     * Category row is unique by aria-label (e.g. "Featured Apps", "Video", ...)
     * @param {string} categoryName
     */
    categoryByName(categoryName) {
        const row = this.root
            .locator(
                `[data-testid^="list-item-"][role="list"][aria-label="${categoryName}"]`
            )
            .first();

        return new CategoryAppItemComponent(row, this.page);
    }
}