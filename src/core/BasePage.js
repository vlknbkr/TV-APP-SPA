import { RemoteControl } from '../utils/RemoteControl.js';
import { expect } from '@playwright/test';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';

export class BasePage {
    constructor(page) {
        this.page = page;
        this.remote = new RemoteControl(page);
    }

    async open() {
        throw new Error("Method 'open()' must be implemented.");
    }

    async reload() {
        await this.page.reload();
    }

    /**
     * Protected helper to navigate to a specific path using the BASE_URL.
     * @param {string} path - The path to append to BASE_URL (e.g., 'apps')
     */
    async goto(path = '') {
        await this.page.goto(process.env.BASE_URL + path, { waitUntil: 'domcontentloaded' });
        await this.page.waitForTimeout(4000);
    }

    async expectFocused(focusedElement) {
        await expect(focusedElement).toHaveAttribute('data-focused', 'focused');
    }

    async waitForAppToLoad() {
        await this.page.locator(TITAN_OS_LOCATORS.FEATURED_APPS).waitFor({ state: 'visible' });
    }

    async waitUntilHomeReady() {
        this.page.waitForTimeout(3000);
        const homeMenuItem = this.page.locator(
            TITAN_OS_LOCATORS.HOME_MENU_ITEM
        );

        await expect(async () => {
            await expect(homeMenuItem).toHaveAttribute('aria-selected', 'true');
        }).toPass({
            intervals: [2000, 5000, 10000],
            timeout: 60000
        });
    }
}