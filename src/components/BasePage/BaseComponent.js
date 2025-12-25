export class BaseComponent {
    /**
     * @param {import('@playwright/test').Locator} root
     * @param {import('@playwright/test').Page} page
     */
    constructor(root, page) {
        this.root = root;
        this._page = page;
    }

    page() {
        return this._page;
    }

    locator() {
        return this.root;
    }
}