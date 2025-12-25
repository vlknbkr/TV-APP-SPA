import { BaseComponent } from '../BasePage/BaseComponent.js';
import { CategoryAppItemComponent } from './CategoryAppItemComponent.js';

export class CategoryListComponent extends BaseComponent {

    constructor(root, page) {
        super(root, page);

        this.categoriesLocator = this.root.locator(
            '[data-testid^="list-item-app_list-"][role="list"][aria-label]'
        );

        this.categoryLocator = (name) =>
            this.root.locator(
                `[data-testid^="list-item-app_list-"][role="list"][aria-label="${name}"]`
            );
    }

    getAllCategories() {
        return this.categoriesLocator;
    }

    async getCategoriesCount() {
        return this.getAllCategories().count();
    }

    getCategoryLocator(name) {
        return this.categoryLocator(name).first();
    }

    /**
     * @param {number} i
     */
    getCategoryByIndex(i) {
        const row = this.getAllCategories().nth(i);
        return new CategoryAppItemComponent(row, this.page);
    }

    /**
     * @param {string} categoryName
     */
    getCategoryByName(categoryName) {
        const row = this.getCategoryLocator(categoryName);
        return new CategoryAppItemComponent(row, this.page);
    }

    /**
     * Returns index of category row within lists-container, -1 if not found
     * @param {string} categoryName
     */
    async indexCategory(categoryName) {
        return this.getAllCategories().evaluateAll((els, name) => {
            return els.findIndex((el) => el.getAttribute('aria-label') === name);
        }, categoryName);
    }

    async focusedIndexCategory() {
        return this.getAllCategories().evaluateAll((els) => {
            return els.findIndex((el) => el.getAttribute('data-focused') === 'focused');
        });
    }
}