const { RemoteControl } = require('../utils/RemoteControl').default;
const { expect } = require('@playwright/test');

class BasePage {
    constructor(page) {
        this.page = page;
        this.remote = new RemoteControl(page);
    }

    async open() {
        throw new Error("Method 'open()' must be implemented.");
    }

    /**
     * Protected helper to navigate to a specific path using the BASE_URL.
     * @param {string} path - The path to append to BASE_URL (e.g., 'apps')
     */
    async goto(path = '') {
        await this.page.goto(process.env.BASE_URL + path, { waitUntil: 'networkidle' });
        await this.page.waitForTimeout(4000);

    }

    async isItemFocused(itemName) {
        const focusedItem = this.page.locator(
            `[data-testid="${itemName}"][data-focused="focused"]`
        );
        return await focusedItem.isVisible();
    }

    async waitForAppToLoad() {
        await this.page.locator("div[aria-label='Featured Apps']").waitFor({ state: 'visible' });
    }

    async waitUntilHomeReady() {
        this.page.waitForTimeout(3000);
        const homeMenuItem = this.page.locator(
            '[role="menuitem"][aria-label="Home"][aria-selected]'
        );

        await expect(homeMenuItem).toHaveAttribute('aria-selected', 'true', {
            timeout: 10000,
        });
    }

}

module.exports = { BasePage };