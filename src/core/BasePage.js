import { RemoteControl } from '../utils/RemoteControl.js';

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

    async isLoaded() {
        throw new Error("Method 'isLoaded()' must be implemented by subclass.");
    }
}
