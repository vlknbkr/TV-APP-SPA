import { RemoteControl } from '../utils/RemoteControl.js';
import { expect } from '@playwright/test';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';

export class BasePage {
    constructor(page) {
        this.page = page;
        this.remote = new RemoteControl(page);
    }

    async open() {
        throw new Error("Method 'open()' must be implemented by subclass.");
    }

    async goto(path = '') {
        await this.page.goto(
            `${process.env.BASE_URL}${path}`,
            { waitUntil: 'domcontentloaded' }
        );
    }

    async reloadAndWait(waitPage) {
        await this.reload();
        await waitPage();
    }

    async expectFocused(locator) {
        await expect(
            locator,
            'Expected element to have TV focus'
        ).toHaveAttribute('data-focused', 'focused');
    }
}