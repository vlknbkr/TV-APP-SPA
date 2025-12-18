import { expect } from '@playwright/test';
import { RemoteControl } from '../utils/RemoteControl.js';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';


export class BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     * @param {{ remote?: RemoteControl }} [options]
     */
    constructor(page, options = {}) {
        this.page = page;
        this.remote = options.remote ?? new RemoteControl(page);
    }

    async open() {
        throw new Error("Method 'open()' must be implemented by subclass.");
    }

    async goto(path = '') {
        await this.page.goto(`${process.env.BASE_URL}${path}`, {
            waitUntil: 'domcontentloaded',
        });
        await this.waitForSpaReady();
    }


    async waitForSpaReady({ timeout = 20000 } = {}) {
        await expect(this.page.locator('#root'), 'App root is not visible').toBeVisible({
            timeout,
        });

        const bootLoader = this.page.locator('#loader');
        if ((await bootLoader.count()) > 0) {
            await expect(bootLoader, 'Boot loader overlay still visible').toBeHidden({
                timeout,
            });
        }
    }


    async expectFocused(locator, message = 'Expected element to have TV focus') {
        await expect(locator, message).toHaveAttribute('data-focused', /^(focused|true)$/);
    }

    async waitForFocus(locator, { timeout = 10000 } = {}) {
        await expect(locator).toHaveAttribute('data-focused', /^(focused|true)$/, { timeout });
    }
}
