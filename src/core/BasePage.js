const { RemoteControl } = require('../utils/RemoteControl');
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
    }

}

module.exports = { BasePage };