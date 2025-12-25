import { BaseComponent } from '../BasePage/BaseComponent.js';
import { AppItemComponent } from './AppItemComponent.js';

export class CategoryAppItemComponent extends BaseComponent {
    static SELECTORS = {
        group: '[role="group"]',
        item: '[role="listitem"][data-testid]',
        visible: '[aria-hidden="false"]',
        focusedAttr: 'data-focused',
    };

    constructor(root, page) {
        super(root, page);

        this.groupLocator = this.root.locator(CategoryAppItemComponent.SELECTORS.group);
        this.itemsLocator = this.groupLocator.locator(CategoryAppItemComponent.SELECTORS.item);
    }

    appLocator(appName) {
        return this.groupLocator.locator(`[role="listitem"][data-testid="${appName}"]`).first();
    }

    getAppLocator(appName) {
        return this.appLocator(appName);
    }

    item(appName) {
        const tile = this.appLocator(appName);
        return new AppItemComponent(tile, this.page);
    }

    async count() {
        return this.itemsLocator.count();
    }

    async isFocused() {
        const focused = await this.root.getAttribute(CategoryAppItemComponent.SELECTORS.focusedAttr);
        const isFocusedAttr = await this.root.getAttribute('data-is-focused');
        return focused === 'focused' || isFocusedAttr === 'true';
    }

    async indexApp(appName) {
        return this.itemsLocator.evaluateAll((els, name) =>
            els.findIndex(el => el.getAttribute('data-testid') === name || el.getAttribute('aria-label') === name),
            appName
        );
    }

    async focusedIndexApp() {
        return this.itemsLocator.evaluateAll((els, attr) =>
            els.findIndex(el => el.getAttribute(attr) === 'focused'),
            CategoryAppItemComponent.SELECTORS.focusedAttr
        );
    }
}