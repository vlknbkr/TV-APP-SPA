import { expect } from '@playwright/test';

export class RemoteControl {
    /**
     * @param {import('@playwright/test').Page} page
     * @param {{ delay?: number, log?: boolean }} [options]
     */
    constructor(page, options = {}) {
        this.page = page;
        this.delay = options.delay ?? 200;
        this.log = options.log ?? true;
    }

    _log(message) {
        if (this.log) console.log(message);
    }

    /**
     * @param {'ArrowUp'|'ArrowDown'|'ArrowLeft'|'ArrowRight'|'Enter'|'Backspace'} key
     */
    async press(key) {
        await this.page.keyboard.press(key, { delay: this.delay });
        this._log(`[Remote] ${key}`);
    }

    async up() {
        await this.press('ArrowUp');
    }

    async down() {
        await this.press('ArrowDown');
    }

    async left() {
        await this.press('ArrowLeft');
    }

    async right() {
        await this.press('ArrowRight');
    }

    async back() {
        await this.press('Backspace');
        this._log('[Remote] BACK');
    }

    /**
     * @param {import('@playwright/test').Locator} target
     */
    async assertFocused(target) {
        await expect(target).toHaveAttribute('data-focused', 'true');
    }

    /**
     * @param {{ ensureFocused?: import('@playwright/test').Locator }} [opts]
     */
    async select(opts = {}) {
        if (opts.ensureFocused) {
            await this.assertFocused(opts.ensureFocused);
        }
        await this.press('Enter');
        this._log('[Remote] SELECT');
    }

    /**
     * @param {{ ms?: number, ensureFocused?: import('@playwright/test').Locator }} [opts]
     */
    async longPressSelect(opts = {}) {
        const duration = opts.ms ?? 2000;
        if (opts.ensureFocused) {
            await this.assertFocused(opts.ensureFocused);
        }

        this._log(`[Remote] LONG SELECT (${duration}ms)`);
        await this.page.keyboard.down('Enter');
        await this.page.waitForTimeout(duration);
        await this.page.keyboard.up('Enter');
    }
}
